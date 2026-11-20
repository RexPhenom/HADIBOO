-- Applied 2026-11-20. Internal helper functions can no longer be called by visitors through the API.
revoke execute on function public.hadiboo_purge_expired_jobs() from public, anon, authenticated;
revoke execute on function public.hadiboo_review_defaults() from public, anon, authenticated;
revoke execute on function public.hadiboo_throttle() from public, anon, authenticated;
grant execute on function public.hadiboo_purge_expired_jobs() to authenticated;
alter function public.hadiboo_keep_one_admin() set search_path = public;
