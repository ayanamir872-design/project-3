-- Public booking requests may be created through the API using the publishable key.
-- Public clients cannot read, update, or delete appointment rows.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'appointments'
      and policyname = 'public_can_create_pending_appointments'
  ) then
    create policy "public_can_create_pending_appointments"
      on public.appointments
      for insert
      to anon, authenticated
      with check (
        status = 'pending'
        and char_length(trim(customer_name)) between 2 and 120
        and char_length(trim(phone_number)) between 7 and 30
        and char_length(trim(service_name)) between 2 and 120
        and char_length(appointment_time) between 3 and 20
        and (notes is null or char_length(notes) <= 1000)
        and appointment_date >= current_date
      );
  end if;
end
$$;
