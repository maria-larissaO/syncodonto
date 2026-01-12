"use client"

import { SustainabilityImpact } from "./sustainability-impact"
import { DocumentActions } from "./document-actions"
import { DocumentList } from "./document-list"
import { DigitalSignature } from "./digital-signature"

export function DocumentManagementView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestão Paperless</h1>
        <p className="text-muted-foreground">Documentos digitais e sustentabilidade</p>
      </div>

      {/* Sustainability Impact */}
      <SustainabilityImpact />

      {/* Document Actions */}
      <DocumentActions />

      {/* Document List */}
      <DocumentList />

      {/* Digital Signature */}
      <DigitalSignature />
    </div>
  )
}
