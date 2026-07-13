# Security policy

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting for this repository. Do not open a public issue with credential material, customer data, or a working exploit.

Include the affected version, a short reproduction, and the impact you observed. Sanitized logs are useful, but remove access tokens, customer IDs, profile IDs, message content, and personal information first.

## Supported versions

Security fixes are made against the latest npm release. Older versions may not receive patches.

## Credential handling

The server reads credentials from environment variables, a saved local OAuth session, or the optional 1Password CLI fallback. It does not need a Sprout account password. Never place a token or client secret in a checked-in MCP configuration.
