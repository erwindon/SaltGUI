## Subresource Integrity

If you are loading Highlight.js via CDN you may wish to use [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) to guarantee that you are using a legimitate build of the library.

To do this you simply need to add the `integrity` attribute for each JavaScript file you download via CDN. These digests are used by the browser to confirm the files downloaded have not been modified.

```html
<script
  src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/highlight.min.js"
  integrity="sha384-pGqTJHE/m20W4oDrfxTVzOutpMhjK3uP/0lReY0Jq/KInpuJSXUnk4WAYbciCLqT"></script>
<!-- including any other grammars you might need to load -->
<script
  src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/languages/go.min.js"
  integrity="sha384-Mtb4EH3R9NMDME1sPQALOYR8KGqwrXAtmc6XGxDd0XaXB23irPKsuET0JjZt5utI"></script>
```

The full list of digests for every file can be found below.

### Digests

```
sha384-R87hRh4kF8+iz2sB6FvLrfR0XZBohjFXeJKIXld1Eji2UVi+M2+OIgJKma/9Ko6u /es/languages/json.js
sha384-QFDPNpqtrgZCuAr70TZJFM4VCY+xNnyGKwJw2EsWIBJOVcWAns9PHcLzecyDVv+x /es/languages/json.min.js
sha384-40MP6/ECSjYaTAIf+/ibE2FPeFPQ53WbASndXxMOcXiQtgLbGXUStZVuPSngp7OD /es/languages/yaml.js
sha384-vXmhozexi2dHQBoniIEbWI5ZqDxyVfUs96BUGpqjWL1aberSp9pyxbvK8WCNASGB /es/languages/yaml.min.js
sha384-psmmPlbfEWGyvRapexDqkVTgNz7Y1xvlGdLNWQSafI4GFQYFDXPZxVXH1laU4n6l /languages/json.js
sha384-Bb6DhE3tUpBROwypL78TbhRUs9QbCt2GxcxVSYglt2l3MefrYkm4CfwjfWhRfQaX /languages/json.min.js
sha384-3KIoWvJ5JGRH35WAkzreEebY8sug+ZWeaOPS2r1KIfznEU9TtPFpxX6sIgtaiA9G /languages/yaml.js
sha384-bMkvdnz+wPu1ro0fqO3BaDWztc7RzSvw05MQFP6bhJKDcwpkrFYTfTFI9ndkP11l /languages/yaml.min.js
sha384-K/lmlGQ1csQn1mpVy2e8KFC/I4UCJeKBL/puxNMhryz5acaA340QirqJpbtwfunZ /highlight.js
sha384-wZNnxh6Gd4U6ufGOj7cOmK8M/H4Vfs81NXsomfxq45v4e3jiZL1dUYAn0GmlMJ+L /highlight.min.js
```

