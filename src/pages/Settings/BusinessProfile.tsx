import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { useSettingsController } from "../../controllers/settings.controller";

type BusinessProfileForm = {
  businessName: string;
  displayPhone: string;
  category: string;
  timezone: string;
  optOutKeyword: string;
};

export const BusinessProfile = () => {
  const settingsController = useSettingsController();
  const { loadBusinessProfile } = settingsController;
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<BusinessProfileForm>({
    businessName: "",
    displayPhone: "",
    category: "Other",
    timezone: "Asia/Kolkata",
    optOutKeyword: "STOP",
  });
  const [initialForm, setInitialForm] = useState<BusinessProfileForm | null>(null);

  const isDirty = useMemo(() => {
    if (!initialForm) return false;
    return (
      form.category !== initialForm.category ||
      form.timezone !== initialForm.timezone ||
      form.optOutKeyword !== initialForm.optOutKeyword
    );
  }, [form, initialForm]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await loadBusinessProfile();
      if (result.ok) {
        setForm(result.data);
        setInitialForm(result.data);
      }
      setIsLoading(false);
    };
    void load();
  }, [loadBusinessProfile]);

  const update =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-5">
      <h3 className="font-[Syne,sans-serif] text-[15px] font-semibold text-gray-900">
        Business Profile
      </h3>

      {isLoading ? (
        <p className="text-[13px] text-gray-500">Loading profile...</p>
      ) : (
      <div className="space-y-4">
        {(
          [
            ["businessName", "Business Name (Meta)", "text", "Your business display name"],
            ["displayPhone", "Display Phone (Meta)", "text", "+91 format"],
            ["optOutKeyword", "Opt-out Keyword", "text", "e.g. STOP"],
          ] as [string, string, string, string][]
        ).map(([key, label, type, placeholder]) => (
          <div key={key}>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">
              {label}
            </label>
            <input
              type={type}
              value={form[key as keyof typeof form]}
              onChange={update(key)}
              readOnly={key === "businessName" || key === "displayPhone" || !isEditing}
              placeholder={placeholder}
              className={`w-full border rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none transition-colors ${
                key === "businessName" || key === "displayPhone" || !isEditing
                  ? "bg-gray-50 border-gray-200 opacity-70 cursor-default"
                  : "bg-gray-50 border-gray-200 focus:border-green-500 focus:bg-white"
              }`}
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={update("category")}
              disabled={!isEditing}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {[
                "E-commerce",
                "Retail",
                "FMCG",
                "Fashion",
                "Electronics",
                "Food & Beverage",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">
              Timezone
            </label>
            <select
              value={form.timezone}
              onChange={update("timezone")}
              disabled={!isEditing}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {[
                "Asia/Kolkata",
                "Asia/Dubai",
                "Asia/Singapore",
                "Europe/London",
                "America/New_York",
              ].map((tz) => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      )}

      <div className="pt-2 border-t border-gray-100 flex items-center gap-2.5">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
            Edit
          </Button>
        ) : (
          <>
            <Button
              loading={isSaving}
              disabled={!isDirty}
              onClick={async () => {
                setIsSaving(true);
                const result = await settingsController.saveBusinessProfile({
                  category: form.category,
                  timezone: form.timezone,
                  optOutKeyword: form.optOutKeyword,
                });
                if (result.ok) {
                  setForm(result.data);
                  setInitialForm(result.data);
                  setIsEditing(false);
                }
                setIsSaving(false);
              }}
            >
              Save Changes
            </Button>
            <Button
              variant="ghost"
              disabled={isSaving}
              onClick={() => {
                if (initialForm) setForm(initialForm);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
