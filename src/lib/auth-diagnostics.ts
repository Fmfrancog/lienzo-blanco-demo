// Only fixed, public diagnostics leave this module. Never display/store raw OAuth errors.
export function authDiagnostic(code?: string, description?: string): string {
  let category = "CALLBACK";
  let help = "No se pudo completar el regreso de Google. Inténtalo una vez más.";
  if (code === "access_denied") {
    category = "DENIED";
    help = "No se pudo iniciar sesión: el acceso fue cancelado o rechazado. Puedes volver a intentarlo con Google.";
  } else if (["provider_disabled", "oauth_provider_not_supported", "bad_oauth_client_state", "invalid_client"].includes(code || "")) {
    category = "CONFIG";
    help = "No se pudo iniciar sesión con Google por un problema de configuración del acceso. Si se repite, informa este código a PLUR.";
  } else if (code === "missing_verifier") {
    category = "VERIFIER";
    help = "No se encontró la verificación de este intento. Inicia sesión otra vez desde esta misma pestaña y navegador.";
  } else if (["flow_state_expired", "flow_state_not_found", "bad_code_verifier", "invalid_grant"].includes(code || "")) {
    category = "EXPIRED";
    help = "Este intento de acceso venció o no se pudo verificar. Inicia sesión otra vez desde esta misma pestaña.";
  } else if (code === "server_error" || code === "unexpected_failure" || code === "oauth_callback_error" || description?.startsWith("Unable to exchange external code")) {
    category = "PROVIDER";
    help = "No se pudo completar la conexión entre Google y el servicio de acceso. Inténtalo una vez más; si se repite, informa este código a PLUR.";
  }
  return `${help} Código: PLUR-AUTH-${category}.`;
}

export function clearAuthCallback() {
  const url = new URL(window.location.href);
  const hash = new URLSearchParams(url.hash.slice(1));
  for (const key of ["error", "error_code", "error_description", "code", "state", "access_token", "refresh_token", "provider_token", "provider_refresh_token", "expires_in", "expires_at", "token_type", "sb", "flow_id"]) {
    url.searchParams.delete(key);
    hash.delete(key);
  }
  // Preserve ordinary anchor links, as well as unrelated query/hash parameters.
  if (url.hash.includes("=")) url.hash = hash.toString();
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}
