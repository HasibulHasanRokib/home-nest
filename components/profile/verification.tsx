"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { CircleAlert, CircleCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getVerificationData, updateVerification } from "@/app/profile/actions";
import { Spinner } from "../ui/spinner";

interface DocumentVerification {
  id: string;
  name: string;
  verified: boolean;
  notes: string;
}

function groupByCategory(docs: DocumentVerification[]) {
  return {
    "Personal Info": docs.filter((d) =>
      ["info", "nid", "birth", "passport"].includes(d.id)
    ),
    Address: docs.filter((d) => ["present", "permanent"].includes(d.id)),
    "Social Links": docs.filter((d) =>
      ["facebook", "twitter", "linkedin", "whatsapp"].includes(d.id)
    ),
    Legal: docs.filter((d) => d.id === "declaration"),
  };
}

export function VerificationManagement({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<DocumentVerification[]>([]);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>(
    {}
  );
  const [editingVerified, setEditingVerified] = useState<{
    [key: string]: boolean;
  }>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function load() {
      const data = await getVerificationData(userId);
      setDocuments(data);

      const verifiedMap: { [key: string]: boolean } = {};
      const notesMap: { [key: string]: string } = {};
      data.forEach((doc) => {
        verifiedMap[doc.id] = doc.verified;
        notesMap[doc.id] = doc.notes;
      });
      setEditingVerified(verifiedMap);
      setEditingNotes(notesMap);
    }
    load();
  }, [userId]);

  const handleSave = async (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    setSaving((prev) => ({ ...prev, [docId]: true }));

    try {
      await updateVerification(
        userId,
        docId,
        editingVerified[docId],
        editingNotes[docId]
      );

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                verified: editingVerified[docId],
                notes: editingNotes[docId],
              }
            : d
        )
      );

      setExpandedDoc(null);
    } finally {
      setSaving((prev) => ({ ...prev, [docId]: false }));
    }
  };

  const grouped = groupByCategory(documents);

  return (
    <Card>
      <CardContent>
        {Object.entries(grouped).map(([category, docs]) => (
          <div key={category} className="mb-6">
            <h3 className="p-2 text-lg font-semibold">{category}</h3>
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="dark:border-accent rounded border border-gray-200"
              >
                <div className="flex items-center justify-between p-2.5">
                  <div className="flex items-center gap-3">
                    {doc.verified ? (
                      <CircleCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <CircleAlert className="h-5 w-5 text-red-500" />
                    )}
                    <p>{doc.name}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedDoc(expandedDoc === doc.id ? null : doc.id)
                    }
                  >
                    {expandedDoc === doc.id ? "Close" : "Edit"}
                  </Button>
                </div>

                {/* Expanded form */}
                {expandedDoc === doc.id && (
                  <div className="dark:bg-accent border-t bg-gray-50 px-8 py-4">
                    <div className="space-y-6 py-4">
                      {/* Checkbox */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`verified-${doc.id}`}
                          checked={editingVerified[doc.id]}
                          onCheckedChange={(checked) =>
                            setEditingVerified((prev) => ({
                              ...prev,
                              [doc.id]: checked as boolean,
                            }))
                          }
                        />
                        <Label
                          htmlFor={`verified-${doc.id}`}
                          className="text-sm leading-none font-medium"
                        >
                          Mark as Verified
                        </Label>
                      </div>

                      {/* Notes */}
                      <div className="space-y-3">
                        <Label>Verification Notes</Label>
                        <Textarea
                          value={editingNotes[doc.id] ?? ""}
                          onChange={(e) =>
                            setEditingNotes({
                              ...editingNotes,
                              [doc.id]: e.target.value,
                            })
                          }
                          className="min-h-20 resize-none"
                          placeholder="Add verification notes..."
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedDoc(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          disabled={saving[doc.id]}
                          onClick={() => handleSave(doc.id)}
                        >
                          {saving[doc.id] ? <Spinner /> : "Save"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
