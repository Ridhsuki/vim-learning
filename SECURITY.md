# Security Policy

## Supported Versions

VimTutor is a static educational web application with no backend, no user accounts, and no server-side processing. Only the latest deployed version at [ridhsuki.github.io/vim-learning](https://ridhsuki.github.io/vim-learning/) is actively maintained.

| Version | Supported |
|---------|-----------|
| Latest  | ✅ Yes     |
| Older   | ❌ No      |

---

## Reporting a Vulnerability

If you believe you have found a security issue, **please do not open a public GitHub issue**.

Instead, report it privately by:
- Opening a [GitHub Security Advisory](https://github.com/Ridhsuki/vim-learning/security/advisories/new) (preferred)
- Or emailing the maintainer directly via the contact listed on their GitHub profile

Please include:
- A clear description of the issue
- Steps to reproduce (if applicable)
- Potential impact

You will receive a response within 7 days.

---

## What Counts as a Security Issue

- Cross-site scripting (XSS) vulnerabilities introduced by lesson content or dynamic rendering
- Dependency vulnerabilities with a CVSS score ≥ 7.0 that affect the client-side bundle

---

## What Does Not Count as a Security Issue

- Issues related to `localStorage` (data is stored locally per-user; no sensitive data is involved)
- GitHub Pages infrastructure or hosting issues (out of scope)
- Missing HTTPS (GitHub Pages enforces HTTPS by default)
- Browser-level security warnings unrelated to the app's code

---

## General Notes

This app stores only lesson progress in `localStorage`. It does not collect, process, or transmit any personal data. Do not post sensitive information in public GitHub issues.
