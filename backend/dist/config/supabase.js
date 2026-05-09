"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createClient } = require("@supabase/supabase-js");
let cachedClient = null;
function normalizeSupabaseUrl(raw) {
    const trimmed = raw.trim().replace(/\/+$/, "");
    // Remove accidental /rest/v1 if pasted
    return trimmed.replace(/\/rest\/v1$/i, "");
}
function getSupabaseClient() {
    if (cachedClient) {
        return cachedClient;
    }
    const supabaseUrlRaw = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrlRaw) {
        throw new Error("SUPABASE_URL missing in .env");
    }
    if (!supabaseKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY missing in .env");
    }
    const supabaseUrl = normalizeSupabaseUrl(supabaseUrlRaw);
    cachedClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
        realtime: {
            params: {
                eventsPerSecond: 1,
            },
        },
    });
    return cachedClient;
}
module.exports = { getSupabaseClient };
//# sourceMappingURL=supabase.js.map