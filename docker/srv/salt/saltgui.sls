# SaltGUI Deployment State
# This state configures both the SaltGUI files and master configuration

# Deploy SaltGUI files
saltgui_files:
  file.recurse:
    - name: /saltgui
    - source: salt://saltgui
    - user: root
    - group: root
    - file_mode: 644
    - dir_mode: 755
    - clean: False
    - makedirs: True

# Configure salt-master for SaltGUI (only on masters)
{% if 'master' in grains.get('roles', []) or grains.get('saltgui_master', False) %}

# Backup original master config
/etc/salt/master.backup:
  file.copy:
    - source: /etc/salt/master
    - force: True
    - preserve: True
    - unless: test -f /etc/salt/master.backup

# Configure master with SaltGUI settings
saltgui_master_config:
  file.blockreplace:
    - name: /etc/salt/master
    - marker_start: "# SaltGUI Configuration - DO NOT EDIT MANUALLY"
    - marker_end: "# End SaltGUI Configuration"
    - unless: grep -q "rest_cherrypy:" /etc/salt/master
    - content: |
        # REST API Configuration for SaltGUI
        rest_cherrypy:
          port: 3333
          host: 0.0.0.0
          disable_ssl: true
          app: /saltgui/index.html
          static: /saltgui/static
          static_path: /static
        
        # External Authentication for SaltGUI
        external_auth:
          pam:
            salt:
              - .*
              - '@runner'
              - '@wheel'
              - '@jobs'
        
        # Enable required clients for SaltGUI
        netapi_enable_clients:
          - local
          - local_async
          - runner
          - wheel
        
        # SaltGUI Templates (optional - customize as needed)
        saltgui_templates:
          system_info:
            description: "System Information"
            target: "*"
            command: "grains.items"
          disk_usage:
            description: "Check Disk Usage"
            target: "*"
            command: "disk.usage"
          service_status:
            description: "Service Status Check"
            targettype: "glob"
            target: "*"
            command: "service.get_all"
          test_ping:
            description: "Test Connectivity"
            target: "*"
            command: "test.ping"
    - append_if_not_found: True
    - require:
      - file: /etc/salt/master.backup
    - watch_in:
      - cmd: salt_master_status

# Note: salt-master service management
# In containerized environments, salt-master may not be available as a system service
# The configuration will be applied on next salt-master restart
salt_master_status:
  cmd.run:
    - name: echo "SaltGUI configuration applied. Salt-master restart may be required for changes to take effect."
    - require:
      - file: saltgui_master_config

# Create SaltGUI user for authentication
saltgui_user:
  user.present:
    - name: {{ pillar.get('saltgui_username', 'salt') }}
    - password: {{ pillar.get('saltgui_password_hash', '$6$rounds=656000$YQKmQUgUbpL2IJt.$X8y2wHvE.secMw6w8VRkGN6hSV/j.SFZYyZ8hi8/SN6RCK/JdBVMW9vBR3gbcfCBeSdnDHjBPrL0xhrHm6g0b.') }}
    - shell: /bin/bash
    - home: /home/{{ pillar.get('saltgui_username', 'salt') }}
    - createhome: True
    - groups:
      - sudo

# Ensure PAM authentication is available
pam_auth_package:
  pkg.installed:
    - pkgs:
      - python3-pam
    - require_in:
      - user: saltgui_user

# Display login credentials
saltgui_credentials_info:
  cmd.run:
    - name: |
        echo "========================================"
        echo "SaltGUI Login Credentials:"
        echo "Username: {{ pillar.get('saltgui_username', 'salt') }}"
        echo "Password: {{ pillar.get('saltgui_plain_password', 'saltgui') }}"
        echo "URL: http://localhost:3333"
        echo "========================================"
    - require:
      - user: saltgui_user

{% endif %}

# Create SaltGUI configuration file
/saltgui/config.js:
  file.managed:
    - contents: |
        // SaltGUI Configuration
        // This file can be customized per deployment
        window.config = {
          API_URL: window.location.protocol + '//' + window.location.hostname + ':3333',
          PAGE_SIZE: 25,
          REFRESH_RATE: 5000,
          DATETIME_REPRESENTATION: 'local'
        };
    - user: root
    - group: root
    - mode: 644
    - require:
      - file: saltgui_files

# Create nginx configuration for SaltGUI (optional reverse proxy)
/etc/nginx/sites-available/saltgui:
  file.managed:
    - contents: |
        server {
            listen 80;
            server_name {{ grains.get('fqdn', 'localhost') }} localhost;
            
            location / {
                proxy_pass http://127.0.0.1:3333;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
            
            # Static files served directly
            location /static/ {
                alias /saltgui/static/;
                expires 1d;
                add_header Cache-Control "public, immutable";
            }
        }
    - user: root
    - group: root
    - mode: 644
    - makedirs: True
