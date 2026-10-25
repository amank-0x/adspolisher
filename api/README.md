# Available Endpoints for document scanning

 1. GET  /health 

   • Purpose: Health check endpoint
   • Returns:  {"status": "ok"} 
   • No parameters required

 2. POST  /screen-document 

   • Purpose: Main document screening endpoint
   • Parameters:
     •  doc_image  (file): Document image to analyze
     •  live_image  (file): Live photo of the person
   • Returns: Combined analysis results including:
     •  ocr_validation : OCR and MRZ parsing results
     •  tamper_detection : Photo tampering detection results
     •  face_verification : Face matching results
     •  overall : Overall risk assessment (score, level, reasons)


# Access Documentation

When the server is running, you can access:
   • Swagger UI:  http://127.0.0.1:8000/docs  (interactive API documentation)
   • ReDoc:  http://127.0.0.1:8000/redoc  (alternative documentation view)


# From your frontend, make a POST request to: http://127.0.0.1:8000/screen-document
 

 Example Frontend Calls

 JavaScript/Fetch:
 
   const formData = new FormData();
   formData.append('doc_image', docImageFile);
   formData.append('live_image', liveImageFile);
 
   fetch('http://127.0.0.1:8000/screen-document', {
     method: 'POST',
     body: formData
   })
   .then(response => response.json())
   .then(data => console.log(data));
 

 Axios:

   const formData = new FormData();
   formData.append('doc_image', docImageFile);
   formData.append('live_image', liveImageFile);
 
   axios.post('http://127.0.0.1:8000/screen-document', formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   })
   .then(response => console.log(response.data));


# Response

{
  "ocr_validation": {
    "visual": {
      "passport_number": "L8001016",
      "name": "TALWINDER SINGH None",
      "sex": "M",
      "date_of_birth": "19/06/1994",
      "date_of_issue": "24/03/2014",
      "date_of_expiry": "23/03/2024",
      "nationality": "INDIAN"
    },
    "mrz": {
      "mrz_line1": "P<IND<<TALWINDER<SINGH<<<<<<<<<<<<<<<<<<<<<<",
      "mrz_line2_raw": "L8001016<91ND9406199M2403236<<<<<<<<<<<<<<<4",
      "mrz_line2": "L8001016<9IND9406199M2403236<<<<<<<<<<<<<<<4",
      "document_type": "P",
      "issuing_country": "IND",
      "issuing_country_corrected": false,
      "surname": null,
      "given_names": "TALWINDER SINGH",
      "name_mrz": "TALWINDER SINGH None",
      "passport_number_mrz": "L8001016",
      "nationality_mrz": "IND",
      "nationality_corrected": true,
      "dob_mrz": "940619",
      "sex_mrz": "M",
      "expiry_mrz": "240323",
      "checksum_valid": {
        "passport_number": true,
        "dob": true,
        "expiry": true
      },
      "was_recovered": true
    },
    "ocr_issues": [],
    "mrz_parsed_successfully": true
  },
  "tamper_detection": {
    "tampered_probability": 44.17,
    "decision": "Medium Risk - Needs Manual Review",
    "rule_override_triggered": false,
    "features": {
      "ela": 0.31,
      "edge": 28.85,
      "noise_texture": 18.22,
      "sharpness": 57.79
    }
  },
  "face_verification": {
    "match": false,
    "similarity": 0.0002,
    "threshold": 0.42,
    "risk_level": "High",
    "message": "Faces do not match",
    "doc_face": {
      "bbox": [
        92,
        94,
        164,
        187
      ],
      "score": 0.8850088715553284,
      "source": "insightface"
    },
    "live_face": {
      "bbox": [
        408,
        244,
        911,
        929
      ],
      "score": 0.8259860277175903,
      "source": "insightface"
    }
  },
  "overall": {
    "overall_risk_score": 42.67,
    "risk_level": "Medium Risk",
    "reasons": [
      "Faces do not match"
    ]
  }
}