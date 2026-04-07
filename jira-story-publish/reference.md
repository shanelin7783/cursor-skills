# Reference: TSWE defaults

## Site-specific ids (Arcadie — re-verify if your admin changes fields)

| UI / concept | Field id | Notes |
|--------------|----------|--------|
| Squad | `customfield_18750` | Multiselect; Tech SaaS = `26753` |
| Brand Markets | `customfield_11476` | Multiselect; see option ids below |
| DoR/AC/DoD | `customfield_10115` | **ADF** document only |
| Epic Link (classic) | `customfield_10014` | String epic key, e.g. `TSWE-66` |
| Parent (hierarchy) | `parent` | `{"key": "TSWE-66"}` |

### Brand Markets option ids (default set)

| Label | id |
|-------|-----|
| F1M1 | 14237 |
| F1M2 | 14238 |
| F1M3 | 14239 |
| J1M1 | 14242 |
| J1M2 | 14243 |
| J1M3 | 14244 |
| P1M1 | 14245 |

`additional_fields` example fragment:

```json
"customfield_18750": [{"id": "26753"}],
"customfield_11476": [
  {"id": "14237"}, {"id": "14238"}, {"id": "14239"},
  {"id": "14242"}, {"id": "14243"}, {"id": "14244"}, {"id": "14245"}
]
```

## Disclaimer

Field and option ids differ across **Jira Cloud sites**, **projects**, and **issue type screens**. Treat this file as a **working snapshot** for TSWE Stories; refresh ids when Jira admins change configuration.
