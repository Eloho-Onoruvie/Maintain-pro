# Storage Standard

**Version:** 1.0
**Status:** Draft
**Location:** `/docs/05-engineering/infrastructure/storage-standard.md`

---

# 1. Purpose

This document defines the storage strategy used throughout the MaintainPro platform.

Storage is responsible for managing binary assets and documents that should not reside inside the primary database.

The storage system must be:

* secure
* scalable
* provider-independent
* resilient
* auditable

---

# 2. Philosophy

The database stores metadata.

Object storage stores files.

Binary objects should never be embedded directly inside business collections except for very small assets (e.g., icons or configuration snippets).

---

# 3. Storage Architecture

```text id="lh03ie"
Application

↓

Storage Service

↓

Storage Provider

↓

Object Storage
```

Business modules communicate only with the Storage Service.

---

# 4. Storage Responsibilities

The Storage Service manages:

* uploads
* downloads
* replacements
* deletions
* archival
* metadata retrieval
* access validation

Business modules should not communicate directly with storage providers.

---

# 5. Supported File Types

Examples include:

* Images
* PDFs
* Work Order Attachments
* Asset Manuals
* Contracts
* Inspection Reports
* Purchase Receipts
* Export Files
* AI Generated Reports

Allowed file types should be explicitly configured.

---

# 6. Storage Providers

MaintainPro should support pluggable providers.

Examples:

* Local Storage (development)
* Amazon S3
* Cloudflare R2
* Azure Blob Storage
* Google Cloud Storage

Application code should remain provider-independent.

---

# 7. Storage Paths

Objects should follow predictable paths.

Example

```text id="jlwmvd"
organizations/{organizationId}/

assets/{assetId}/

vendors/{vendorId}/

work-orders/{workOrderId}/

reports/{year}/{month}/
```

Paths should reflect business ownership.

---

# 8. File Naming

Stored filenames should not depend on user-provided names.

Use generated identifiers.

Example

```text id="r6h9k2"
asset-photo-

invoice-

inspection-

contract-
```

Original filenames should be preserved as metadata when required.

---

# 9. Metadata

Every stored object should include metadata such as:

* file identifier
* original filename
* MIME type
* size
* checksum
* upload timestamp
* uploaded by
* organization

Metadata belongs in the database.

---

# 10. Access Control

Storage access must respect application authorization.

Examples:

* Organization isolation
* Vendor isolation
* Signed URLs
* Temporary download links

Storage providers should never expose unrestricted public access unless explicitly intended.

---

# 11. Upload Validation

Uploads should validate:

* MIME type
* file extension
* maximum size
* checksum (optional)
* malware scanning (future)

Invalid files should be rejected before storage.

---

# 12. Versioning

Replacing a file should support version tracking when business requirements demand it.

Examples:

* Asset manuals
* Contracts
* Inspection reports

Version history should remain auditable.

---

# 13. Deletion

Business deletion usually means logical deletion.

Physical deletion should follow retention policies.

Deleted files may remain recoverable until retention expires.

---

# 14. Large Files

Large uploads should support:

* streaming
* multipart uploads
* resumable uploads (future)

Application memory should not depend on file size.

---

# 15. Security

Storage must never expose:

* internal bucket names
* provider credentials
* storage endpoints
* unrestricted object URLs

Secrets remain in the configuration system.

---

# 16. Monitoring

Storage metrics include:

* upload success rate
* download latency
* storage usage
* failed uploads
* failed downloads
* storage provider health

Monitoring integrates with observability.

---

# 17. Backup

Object storage should be backed up independently from the database.

Metadata and binary objects must remain synchronized.

Backup policies are defined separately in the Backup & Restore Standard.

---

# 18. Testing

Storage tests verify:

* uploads
* downloads
* replacements
* authorization
* metadata creation
* deletion
* provider failures

Business services should be testable using mocked storage providers.

---

# 19. Architectural Rules

* Binary files belong in object storage.
* Metadata belongs in the database.
* Storage providers remain replaceable.
* Storage paths follow business ownership.
* Uploads are validated before persistence.
* Access follows application authorization.
* Storage operations are observable.
* Large files use streaming techniques.

---

# 20. Anti-Patterns

Avoid:

* storing files directly in MongoDB
* exposing bucket URLs
* using user filenames as storage keys
* bypassing authorization
* storing secrets in metadata
* loading entire large files into memory

---

# 21. Future Enhancements

The storage platform should support:

* image optimization
* thumbnail generation
* document previews
* OCR processing
* AI document indexing
* lifecycle policies
* cross-region replication

---

# 22. Guiding Principle

> **MaintainPro separates business data from binary content by treating object storage as a dedicated infrastructure service. Files remain secure, scalable, provider-independent, and fully governed by application authorization while business metadata remains in the database.**
