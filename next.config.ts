import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://nxlpgklwggcrfiewpkdn.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54bHBna2x3Z2djcmZpZXdwa2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTU5OTMsImV4cCI6MjA4ODY5MTk5M30.fs80LXdd7VqBr8x4Sa3goQfL7ZhqpAGeHRXdOqmvfSY",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
      "sb_publishable_zLo40oLvy33mE09p9Xy6cg_F5QmAql7",
  },
};

export default nextConfig;
