"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createClient } = require("@supabase/supabase-js");
function normalizeSupabaseUrl(raw) {
    const trimmed = raw.trim().replace(/\/+$/, "");
    // Allow users to paste REST URL (…/rest/v1). Supabase client expects project base URL.
    return trimmed.replace(/\/rest\/v1$/i, "");
}
function readSupabaseConfig() {
    const urlRaw = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!urlRaw)
        throw new Error("Missing required env var: SUPABASE_URL");
    if (!key)
        throw new Error("Missing required env var: SUPABASE_SERVICE_ROLE_KEY");
    return {
        url: normalizeSupabaseUrl(urlRaw),
        serviceRoleKey: key,
    };
}
let cachedClient = null;
function getSupabaseClient() {
    if (cachedClient)
        return cachedClient;
    const { url, serviceRoleKey } = readSupabaseConfig();
    cachedClient = createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    return cachedClient;
}
module.exports = { getSupabaseClient };
//# sourceMappingURL=supabase.js.map