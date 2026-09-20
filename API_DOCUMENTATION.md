# API Documentation — SIH26083 Extreme Heatwave Intelligence Platform

## Overview

The platform provides a comprehensive suite of REST APIs serving real-time meteorological observations, composite biometeorological indices (Heat Index, WBGT, UTCI, Stull Wet Bulb, PET, HTSS), ML-driven health risk forecasts (24h to 5-day lead time), population vulnerability scores, hyperlocal ward geospatial data, hospital surge triage, and occupational safety regimens.

All endpoints adhere to standard JSON response conventions and include explicit provenance metadata (`LIVE`, `ESTIMATED`, or `DEMO / SYNTHETIC DATA`).

---

## Base URL
```
http://localhost:3000/api
```

---

## Authentication & Headers
- **Format**: JSON (`Content-Type: application/json; charset=utf-8`)
- **CORS**: Enabled for local and staging domains.
- **Authentication**: Prototype mode currently operates with open read access for evaluators. Secure production endpoints accept Bearer tokens: `Authorization: Bearer <API_KEY>`.

---

## 1. System Health & Telemetry

### `GET /api/health`
Returns the runtime health status, subsystem availability, model weights integrity, and data feed latency.

#### Response (200 OK)
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptimeSeconds": 14285,
  "subsystems": {
    "thermalEngine": "OPERATIONAL",
    "mlInferenceEngine": "OPERATIONAL",
    "gisChoroplethService": "OPERATIONAL",
    "hospitalReadiness": "OPERATIONAL",
    "openMeteoConnector": "OPERATIONAL"
  },
  "dataQuality": {
    "completeness": 99.4,
    "lastSync": "2026-09-20T17:40:00.000Z",
    "telemetryHealth": "OPTIMAL"
  }
}
```

---

## 2. Core Dashboard Telemetry

### `GET /api/dashboard`
Fetches the consolidated overview of the country or selected state, including critical heat alerts, national temperature extrema, composite HTSS, and hospital readiness alerts.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `state` | string | No | `All` | Filter by Indian State or Union Territory |
| `horizon` | string | No | `24h` | Forecast lead time (`24h`, `48h`, `72h`, `5d`) |

#### Response (200 OK)
```json
{
  "timestamp": "2026-09-20T17:40:00.000Z",
  "provenance": {
    "weatherSource": "Open-Meteo & NCMRWF IMDAA Proxy (LIVE)",
    "healthMetrics": "DEMO / SYNTHETIC DATA"
  },
  "summary": {
    "activeSevereAlerts": 14,
    "maxRecordedTemp": 46.2,
    "maxRecordedHTSS": 92.4,
    "criticalHospitals": 3,
    "estimatedExposedWorkers": 248000
  },
  "stateHighlights": [
    {
      "stateCode": "DL",
      "stateName": "Delhi",
      "htss": 91.5,
      "pvs": 68.2,
      "alertLevel": "RED",
      "primaryDriver": "Extreme solar insolation + High urban density"
    }
  ]
}
```

---

## 3. District & Hyperlocal Analytics

### `GET /api/district`
Fetches biometeorological index breakdowns, ML risk predictions, and vulnerability parameters for a specific district.

#### Query Parameters
| Parameter | Type | Required | Example | Description |
|-----------|------|----------|---------|-------------|
| `districtId` | string | Yes | `IN-MH-PUN` | Standard Census / ISO district code |
| `lat` | number | No | `18.5204` | Latitude for dynamic microclimate lookup |
| `lon` | number | No | `73.8567` | Longitude for dynamic microclimate lookup |

#### Response (200 OK)
```json
{
  "districtId": "IN-MH-PUN",
  "districtName": "Pune",
  "state": "Maharashtra",
  "coordinates": { "lat": 18.5204, "lon": 73.8567 },
  "meteorology": {
    "temperature": 41.5,
    "relativeHumidity": 52.0,
    "windSpeed": 12.4,
    "solarRadiation": 890,
    "surfacePressure": 950.2
  },
  "indices": {
    "heatIndex": 54.2,
    "wbgt": 33.8,
    "utci": 44.1,
    "stullWetBulb": 31.4,
    "pet": 43.6,
    "htss": 88.6,
    "htssCategory": "EXTREME",
    "safeguardTriggered": true
  },
  "vulnerability": {
    "pvs": 61.4,
    "elderlyRatio": 0.098,
    "outdoorWorkerRatio": 0.28,
    "slumDensity": 0.32,
    "compositeHeatRisk": 82.3
  }
}
```

---

## 4. Hyperlocal Ward Matrix (Municipal GIS)

### `GET /api/hyperlocal/wards`
Returns granular ward-level metrics and ranking for supported Tier-1/Tier-2 metropolitan corporations (Pune PMC, Delhi MCD, Ahmedabad AMC).

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `city` | string | Yes | `Pune` | Supported cities: `Pune`, `Delhi`, `Ahmedabad` |

#### Response (200 OK)
```json
{
  "city": "Pune",
  "corporation": "Pune Municipal Corporation (PMC)",
  "totalWards": 15,
  "provenance": "DEMO / SYNTHETIC DATA (Ward Demographics modeled from Census & Local Master Plans)",
  "wards": [
    {
      "wardId": "PUN-W07",
      "wardName": "Bhavani Peth",
      "population": 124500,
      "areaKm2": 3.8,
      "greenCoverPercent": 4.2,
      "tinRoofPercent": 68.4,
      "pvs": 78.5,
      "htss": 89.2,
      "riskScore": 86.8,
      "vulnerabilityTier": "CRITICAL",
      "recommendedMistingPoints": 4
    }
  ]
}
```

---

## 5. Machine Learning Inference & 5-Day Digital Twin

### `POST /api/ml/forecast`
Runs the ML inference engine to predict 24h to 5-day heat-attributable health and mortality risk ratios.

#### Request Body
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "stateCode": "DL",
  "forecastHorizonHours": 120,
  "weatherTimeline": [
    {
      "hour": 24,
      "temperature": 43.8,
      "relativeHumidity": 48.0,
      "windSpeed": 8.5,
      "solarRadiation": 920
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "model": "Ridge-Regression + ERA5 Pretrained Ensemble v1.0",
  "confidenceScore": 0.894,
  "provenance": "DEMO / SYNTHETIC DATA (Relative Risk ratios modeled from epidemiological baselines)",
  "horizons": [
    {
      "leadHours": 24,
      "relativeRisk": 1.48,
      "projectedHeatCrampsRatio": 3.2,
      "projectedHeatStrokeRisk": "HIGH",
      "confidenceInterval": [1.39, 1.57]
    },
    {
      "leadHours": 72,
      "relativeRisk": 1.82,
      "projectedHeatCrampsRatio": 4.5,
      "projectedHeatStrokeRisk": "CRITICAL",
      "confidenceInterval": [1.68, 1.96]
    }
  ]
}
```

---

## 6. What-If Microclimate Simulation

### `POST /api/simulate`
Evaluates microclimate interventions or meteorological shifts dynamically.

#### Request Body
```json
{
  "baseline": {
    "temperature": 42.0,
    "relativeHumidity": 55.0,
    "windSpeed": 8.0,
    "solarRadiation": 850
  },
  "modifiers": {
    "deltaTemperature": -2.5,
    "deltaRelativeHumidity": -5.0,
    "deltaWindSpeed": 4.0,
    "deltaSolarRadiation": -200,
    "coolRoofAdoptionPercent": 40
  }
}
```

#### Response (200 OK)
```json
{
  "baseline": { "htss": 89.4, "utci": 44.2, "wbgt": 33.6 },
  "simulated": { "htss": 78.1, "utci": 39.8, "wbgt": 30.2 },
  "delta": {
    "htssReduction": 11.3,
    "wbgtReduction": 3.4,
    "workerProductivityRetained": "+22%"
  },
  "interventionROI": {
    "hospitalizationRiskMitigationPercent": 18.5,
    "recommendedIntervention": "Urban Green Corridor + Cool Roof Reflective Coating"
  }
}
```

---

## 7. Operational Actions & Emergency Directives

### `GET /api/cooling-centers/recommendations`
Spatial optimization scoring for temporary cooling shelter placement.
- **Formula**: $\text{Score} = \text{Risk} \times \text{Pop}_{\text{vuln}} \times \text{DistanceFactor}$

### `GET /api/hospital-readiness/surge`
Dynamic emergency bed, ORS buffer, and cold saline requirements per district healthcare cluster.

### `GET /api/worker-safety/regimen`
OSHA/ISO 7243 compliant occupational work-rest schedules and mandatory hydration quotas for 5 vulnerability sectors:
1. Construction & Masonry
2. Street Vendors & Hawkers
3. Traffic Police & Security
4. Gig Delivery Couriers
5. Agricultural Laborers

---

## Error Handling Standards

All endpoints return uniform error payloads in accordance with RFC 7807:

```json
{
  "error": {
    "code": "INVALID_COORDINATES",
    "message": "Supplied coordinates are outside the bounding box for India (6.5°N - 37.5°N, 68.0°E - 97.5°E).",
    "timestamp": "2026-09-20T17:40:00.000Z"
  }
}
```

Common status codes:
- `200 OK`: Successful computation and data retrieval.
- `400 Bad Request`: Missing mandatory parameters or invalid numeric ranges.
- `404 Not Found`: District ID or Ward ID not registered in database.
- `500 Internal Server Error`: Computation failure in thermal engine.
