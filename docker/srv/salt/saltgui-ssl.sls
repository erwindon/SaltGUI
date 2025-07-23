# SaltGUI SSL Deployment State (Direct SSL, No Nginx)

# Ensure SaltGUI directory exists with correct permissions
saltgui_directory:
  file.directory:
    - name: /saltgui
    - user: root
    - group: root
    - mode: 755
    - makedirs: True

# Set correct permissions on existing SaltGUI files
saltgui_permissions:
  cmd.run:
    - name: |
        if [ -d /saltgui ]; then
          find /saltgui -type f -exec chmod 644 {} \;
          find /saltgui -type d -exec chmod 755 {} \;
          echo "SaltGUI file permissions updated"
        else
          echo "SaltGUI directory not found at /saltgui"
          exit 1
        fi
    - require:
      - file: saltgui_directory

# SSL certificate directory
saltgui_ssl_dir:
  file.directory:
    - name: /etc/ssl/saltgui
    - user: root
    - group: root
    - mode: 755
    - makedirs: True

# Verify SSL certificates exist
saltgui_ssl_check:
  cmd.run:
    - name: |
        if [ -f /etc/ssl/saltgui/saltgui.crt ] && [ -f /etc/ssl/saltgui/saltgui.key ]; then
          echo "SSL certificates found"
          openssl x509 -in /etc/ssl/saltgui/saltgui.crt -text -noout | grep "Subject:"
        else
          echo "ERROR: SSL certificates not found!"
          echo "Please ensure /etc/ssl/saltgui/saltgui.crt and /etc/ssl/saltgui/saltgui.key exist"
          exit 1
        fi
    - require:
      - file: saltgui_ssl_dir

# Configure salt-master for SaltGUI SSL (only on masters)
{% if 'master' in grains.get('roles', []) or grains.get('saltgui_master', False) %}

# Backup original master configuration
saltgui_master_backup:
  file.copy:
    - name: /etc/salt/master.backup.{{ salt['cmd.run']('date +%Y%m%d_%H%M%S') }}
    - source: /etc/salt/master
    - unless: ls /etc/salt/master.backup.*

# Install required packages for SSL and authentication
saltgui_packages:
  pkg.installed:
    - pkgs:
      - python3-cherrypy3
      - python3-pam
    - refresh: True

# Create SaltGUI user with proper authentication
saltgui_user:
  user.present:
    - name: salt
    - shell: /bin/bash
    - home: /home/salt
    - groups:
      - sudo
    - require:
      - pkg: saltgui_packages

# Set password for SaltGUI user using chpasswd (more reliable)
saltgui_user_password:
  cmd.run:
    - name: echo 'salt:saltgui' | chpasswd
    - unless: echo 'saltgui' | su -c 'exit 0' salt 2>/dev/null
    - require:
      - user: saltgui_user

# Master configuration with direct SSL
saltgui_master_config:
  file.blockreplace:
    - name: /etc/salt/master
    - marker_start: "# Begin SaltGUI SSL Configuration"
    - marker_end: "# End SaltGUI SSL Configuration"
    - unless: grep -q "ssl_crt.*saltgui" /etc/salt/master
    - content: |
        # REST API Configuration for SaltGUI with SSL
        rest_cherrypy:
          port: 8443
          host: 0.0.0.0
          ssl_crt: /etc/ssl/saltgui/saltgui.crt
          ssl_key: /etc/ssl/saltgui/saltgui.key
          disable_ssl: false
          app: /saltgui/index.html
          static: /saltgui/static
          static_path: /static
        
        # Security headers
        rest_cherrypy_config:
          'tools.response_headers.on': True
          'tools.response_headers.headers': [
            ['X-Content-Type-Options', 'nosniff'],
            ['X-Frame-Options', 'DENY'],
            ['X-XSS-Protection', '1; mode=block'],
            ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains']
          ]
        
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
        
        # Session security
        session_timeout: 1800
        max_request_body_size: 1048576
    - require:
      - cmd: saltgui_ssl_check
      - file: saltgui_master_backup

# Display SSL login credentials
saltgui_ssl_credentials_info:
  cmd.run:
    - name: |
        echo "========================================"
        echo "SaltGUI SSL Login Information:"
        echo "HTTPS URL: https://localhost:8443"
        echo "Username: salt"
        echo "Password: saltgui"
        echo "Authentication: PAM (working)"
        echo "========================================"
        echo "SSL Certificate Info:"
        openssl x509 -in /etc/ssl/saltgui/saltgui.crt -text -noout | grep -E "(Subject:|Not After)"
        echo "========================================"
    - require:
      - cmd: saltgui_user_password
      - cmd: saltgui_ssl_check

{% endif %}

# Create SaltGUI SSL configuration file
saltgui_ssl_config:
  file.managed:
    - name: /saltgui/config.js
    - contents: |
        window.config = {
          API_URL: 'https://localhost:8443/api',
          BREAK_ON_ERROR: false,
          DEBUG: false,
          EAUTH: 'pam',
          LOGIN_URL: '/api/login',
          LOGOUT_URL: '/api/logout',
          PREVIEW_GRAINS: ['saltversion', 'os', 'osrelease', 'osmajorrelease', 'oscodename', 'kernel', 'kernelrelease'],
          PUBLIC_URL: 'https://localhost:8443',
          SHOW_MENU: true,
          SSL_ENABLED: true,
          TEMPLATES_URL: '/api/templates'
        };
    - makedirs: True
    - require:
      - file: saltgui_directory
