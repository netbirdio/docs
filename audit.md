# Dashboard Screenshot Audit — New UI Alignment (PR #778)

> Full-coverage audit of all 885 images referenced by the docs, checked against the
> redesigned dashboard UI (new sidebar with Control Center, breadcrumb header, version
> footer). Every image was visually inspected; oversized files were downscaled and
> re-verified in a second pass.
>
> **Total needing re-capture: ~100** — the 38 from the original PR #778 audit plus
> 62 newly found in this sweep.
>
> Excluded by design: `manage/networks/` (PR #779's scope) and everything already
> refreshed on/after 2026-06-05 (PR #782, #767).
>
> Do not commit this file.

## Newly found old-UI screenshots (62)

All paths relative to `public/docs-static/img/`.

### Access Control & posture checks (9)

- [ ] `manage/access-control/associate-peer-groups.png`
- [ ] `manage/access-control/new-rule-list.png`
- [ ] `manage/access-control/user-groups.png`
- [ ] `manage/access-control/posture-checks/posture-checks-01.png`
- [ ] `manage/access-control/posture-checks/posture-checks-09.png`
- [ ] `manage/access-control/posture-checks/posture-checks-11.png`
- [ ] `manage/access-control/posture-checks/posture-checks-12.png`

### EDR & MDM integrations (13)

- [ ] `manage/access-control/endpoint-detection-and-response/crowdstrike-edr/crowdstrike-integration.png`
- [ ] `manage/access-control/endpoint-detection-and-response/crowdstrike-edr/edr-approval-required.png`
- [ ] `manage/access-control/endpoint-detection-and-response/huntress-edr/edr-approval-required.png`
- [ ] `manage/access-control/endpoint-detection-and-response/intune-mdm/edr-approval-required.png`
- [ ] `manage/access-control/endpoint-detection-and-response/sentinelone/edr-approval-required.png`
- [ ] `manage/integrations/mdm-deployment/jamf-pro-netbird-integration/netbird-jamf-02.png`
- [ ] `manage/integrations/mdm-deployment/kandji-netbird-integration/netbird-kandji-02.png`
- [ ] `manage/integrations/mdm-deployment/kandji-netbird-integration/netbird-kandji-16.png`
- [ ] `manage/integrations/mdm-deployment/intune-netbird-integration/intune-02.png`

### Team & Users (10)

- [ ] `manage/team/individual-peer-login-expiration.png`
- [ ] `manage/team/peer-login-expiration.png`
- [ ] `manage/team/user-tab-list.png`
- [ ] `manage/team/user-update-role.png`
- [ ] `manage/team/approve-users/netbird-authentication-settings-approval.png`
- [ ] `manage/team/auto-offboard-users/GT3eAeU.png`
- [ ] `manage/team/auto-offboard-users/MQ2yh6B.png`
- [ ] `manage/team/auto-offboard-users/NKabmN6.png`
- [ ] `manage/team/auto-offboard-users/ogiiUeT.png`
- [ ] `manage/team/auto-offboard-users/sATMbbP.png`

### IdP sync guides (9)

- [ ] `manage/team/idp-sync/microsoft-entra-id-sync/DH5hxFK.png`
- [ ] `manage/team/idp-sync/microsoft-entra-id-sync/qlNlfgV.png`
- [ ] `manage/team/idp-sync/okta-sync/GPTzvut.png`
- [ ] `manage/team/idp-sync/okta-sync/QbzudIU.png`
- [ ] `manage/team/idp-sync/google-workspace-sync/5AcaIqW.png`
- [ ] `manage/team/idp-sync/google-workspace-sync/EkPJqpJ.png`
- [ ] `manage/team/idp-sync/google-workspace-sync/q1aq98X.png`
- [ ] `manage/team/idp-sync/google-workspace-sync/q6tuStz.png`
- [ ] `manage/team/idp-sync/google-workspace-sync/tRbBQsR.png`

### Settings & billing (6)

- [ ] `manage/settings/account-settings-danger-zone.png`
- [ ] `manage/settings/mfa/mfa-not-enrolled.png`
- [ ] `manage/settings/mfa/mfa-reset-mfa.png`
- [ ] `manage/settings/mfa/mfa-settings.png`
- [ ] `manage/settings/plans-and-billing/chose-plan.png`
- [ ] `manage/settings/plans-and-billing/plans-billing-overview.png`

### Activity (3)

- [ ] `manage/activity/activity-monitoring.png`
- [ ] `manage/activity/event-streaming/event-streaming-integration.png`
- [ ] `manage/activity/traffic-events-logging/traffic-events-logging-settings.png`

### Singles & stragglers (12)

- [ ] `manage/dns/netbird-nameserver-add-button.png` (rest of DNS is already new UI)
- [ ] `manage/public-api/personal-access-token-overview.png`
- [ ] `manage/public-api/service-user-overview.png`
- [ ] `get-started/onboarding/16_onboarding-policies.jpeg` (only old-UI image in the onboarding set)
- [ ] `manage/for-partners/msp-portal/tenants.png`
- [ ] `manage/for-partners/acronis-windows-netbird-integration/acronis-windows-03.png`
- [ ] `manage/for-partners/acronis-windows-netbird-integration/acronis-windows-21.png`
- [ ] `use-cases/routing-peers-and-kubernetes/k8s-netbird-agent-connected.png` — PR #782 refreshed the other 3 images on this page but missed this one
- [ ] `manage/network-routes/concepts/routing-peer-groups.png` — missed by the original scan of this folder
- [ ] `manage/peers/access-infrastructure/peer-approval-for-remote-worker-access/peer-a-05.png`
- [ ] `manage/peers/access-infrastructure/peer-approval-for-remote-worker-access/peer-a-12.png`
- [ ] `manage/peers/access-infrastructure/peer-approval-for-remote-worker-access/peer-a-13.png`

## Previously identified in PR #778 audit (38)

### Network Routes feature docs (6)

- [ ] `manage/network-routes/access-control/network-acl-new-policy.png`
- [ ] `manage/network-routes/access-control/network-route-acl-saved.png`
- [ ] `manage/network-routes/concepts/netbird-network-routes-groups-attribution.png`
- [ ] `manage/network-routes/concepts/netbird-network-routes-groups-saved-new.png`
- [ ] `manage/network-routes/concepts/netbird-network-routes-saved-new.png`
- [ ] `manage/network-routes/concepts/netbird-network-routes-saved-new-ha.png`

### Autoscaled environments tutorial (11)

- [ ] `manage/peers/access-infrastructure/access-internal-resources-from-autoscaled-environments/autoscaled-04.png` … `autoscaled-14.png` (all eleven, 04 through 14)

### Peer approval for remote worker access tutorial (11)

- [ ] `manage/peers/access-infrastructure/peer-approval-for-remote-worker-access/peer-0-03.png`
- [ ] `…/peer-a-01.png`, `peer-a-02.png`, `peer-a-03.png`, `peer-a-08.png`, `peer-a-11.png`, `peer-a-14.png`, `peer-a-15.png`, `peer-a-16.png`, `peer-a-17.png`, `peer-a-18.png`
- (plus `peer-a-05`, `peer-a-12`, `peer-a-13` found in this audit — listed above)

### Secure remote webserver access (2)

- [ ] `manage/peers/access-infrastructure/secure-remote-webserver-access/EVZssES.png`
- [ ] `manage/peers/access-infrastructure/secure-remote-webserver-access/LoNxwd4.png`

### DB workload migration / site-to-site (4)

- [ ] `manage/peers/site-to-site/db-workload-migration/workload-migration-01.png`
- [ ] `manage/peers/site-to-site/db-workload-migration/workload-migration-02.png`
- [ ] `manage/peers/site-to-site/db-workload-migration/workload-migration-06.png`
- [ ] `manage/peers/site-to-site/db-workload-migration/workload-migration-07.png`

### Misc (4)

- [ ] `manage/peers/approve-peers/peer-approval-settings.png`
- [ ] `manage/peers/browser-client/peer-list-view.png`
- [ ] `manage/peers/ssh/ssh-dashboard.png`
- [ ] `manage/peers/remote-jobs/debug-bundle.png` — low priority: dialog is the subject, old nav only dimly visible

## Other findings

- **Broken image reference:** `src/pages/get-started/install/mobile.mdx:11` points to
  `/docs-static/img/get-started/mobile/google-play-badge.png`, which does not exist —
  the badge lives at `get-started/android/google-play-badge.png`. One-line fix.
- **Already new UI, no action needed:** Control Center pages, DNS zones/aliases,
  notifications, distributor portal, JumpCloud sync, reverse proxy, IPv6 pages, and
  the onboarding wizard (except image 16 above).
- **~70 borderline images:** modals or tight crops where old dashboard chrome is only
  dimly visible behind a dialog (e.g. IdP connect wizards, policy modals, Intune setup
  modals). Re-capturing these is optional polish — the modal content itself is current.
- **Confidence caveat:** a handful of mid-guide third-party console screenshots
  (Intune/Acronis wizard steps) were classified from doc context rather than viewed
  directly; they show Microsoft/Acronis consoles, so dashboard-UI risk is essentially nil.
