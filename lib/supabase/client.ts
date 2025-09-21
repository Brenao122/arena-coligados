import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  return createBrowserClient(
    "https://fksahbiajrccraxvowtv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NjI4NzQsImV4cCI6MjA1MTMzODg3NH0.WRJGmb3KepODc1EWK1ypkg_-rHuInWe",
  )
}
