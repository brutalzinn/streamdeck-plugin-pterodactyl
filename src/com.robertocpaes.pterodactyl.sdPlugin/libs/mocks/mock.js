//documentation https://dashflo.net/docs/api/pterodactyl/v1/#req_26cd9ef4a75540d6be8b4ef683e2b1a2
//https://pterodactyl.file.properties/api/client
class Mocks {

static server_list_response = {
  "object": "list",
  "data": [
    {
      "object": "server",
      "attributes": {
        "server_owner": true,
        "identifier": "1a7ce997",
        "uuid": "1a7ce997-259b-452e-8b4e-cecc464142ca",
        "name": "Gaming",
        "node": "Test",
        "sftp_details": {
          "ip": "pterodactyl.file.properties",
          "port": 2022
        },
        "description": "Matt from Wii Sports",
        "limits": {
          "memory": 512,
          "swap": 0,
          "disk": 200,
          "io": 500,
          "cpu": 0
        },
        "feature_limits": {
          "databases": 5,
          "allocations": 5,
          "backups": 2
        },
        "is_suspended": false,
        "is_installing": false,
        "relationships": {
          "allocations": {
            "object": "list",
            "data": [
              {
                "object": "allocation",
                "attributes": {
                  "id": 1,
                  "ip": "45.86.168.218",
                  "ip_alias": null,
                  "port": 25565,
                  "notes": null,
                  "is_default": true
                }
              },
              {
                "object": "allocation",
                "attributes": {
                  "id": 2,
                  "ip": "45.86.168.218",
                  "ip_alias": null,
                  "port": 25566,
                  "notes": "Votifier",
                  "is_default": false
                }
              }
            ]
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "total": 1,
      "count": 1,
      "per_page": 50,
      "current_page": 1,
      "total_pages": 1,
      "links": {}
    }
  }
}}