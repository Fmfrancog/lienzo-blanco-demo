"use client";
import { useState } from "react";

const STATES = ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila de Zaragoza", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán de Ocampo", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz de Ignacio de la Llave", "Yucatán", "Zacatecas"];
const FIELDS = [
 { key: "street", label: "Calle", autoComplete: "address-line1", max: 160 },
 { key: "exterior", label: "Número exterior", autoComplete: "off", max: 30, help: "Si no tiene número, escribe S/N." },
 { key: "interior", label: "Número interior (opcional)", autoComplete: "address-line2", max: 30, optional: true },
 { key: "colonia", label: "Colonia", autoComplete: "address-level3", max: 120 },
 { key: "postal", label: "Código postal", autoComplete: "postal-code", max: 5, help: "5 dígitos, incluidos los ceros al inicio." },
 { key: "municipality", label: "Municipio o alcaldía", autoComplete: "address-level2", max: 120 },
] as const;
const EXAMPLES: Record<string, string> = { street: "Ej. Avenida Juárez", exterior: "Ej. 125 o S/N", interior: "Ej. Depto. 4B", colonia: "Ej. Centro", postal: "Ej. 06000", municipality: "Ej. Cuauhtémoc" };
type Address = Record<string, string>;
function serialize(a: Address) {
 return [`${a.street || ""} ${a.exterior || ""}`.trim(), a.interior && `Int. ${a.interior}`, a.colonia && `Col. ${a.colonia}`, a.postal && `C.P. ${a.postal}`, a.municipality, a.state, a.references && `Referencias: ${a.references}`].filter(Boolean).join(", ");
}
export function DeliveryAddress({ onChange }: { onChange: (address: string) => void }) {
 const [values, setValues] = useState<Address>({});
 const [errors, setErrors] = useState<Record<string, string>>({});
 function update(key: string, value: string) {
  const next = { ...values, [key]: value };
  setValues(next);
  setErrors(previous => ({ ...previous, [key]: "" }));
  onChange(serialize(Object.fromEntries(Object.entries(next).map(([k,v]) => [k,v.trim()]))));
 }
 const preview = serialize(Object.fromEntries(Object.entries(values).map(([k,v]) => [k,v.trim()])));
 return <fieldset className="delivery-address"><legend>Dirección de entrega</legend><p className="address-intro">¿Dónde recibes tus playeras? <span>Envíos dentro de México. Los campos opcionales pueden quedar vacíos.</span></p>
 <div className="address-grid">{FIELDS.map(field => {
  const optional = "optional" in field && field.optional;
  const help = "help" in field ? field.help : "";
  return <div className={`address-field address-field--${field.key}`} key={field.key}>
   {field.key === "street" && <h4 className="address-group-title"><span aria-hidden="true">1</span>Calle y números</h4>}
   {field.key === "colonia" && <h4 className="address-group-title"><span aria-hidden="true">2</span>Colonia y ubicación</h4>}
   <label htmlFor={`delivery-${field.key}`}>{field.label}</label>
   <input id={`delivery-${field.key}`} name={field.key} type="text" placeholder={EXAMPLES[field.key]} required={!optional} maxLength={field.max} autoComplete={`shipping ${field.autoComplete}`.replace("shipping off", "off")} inputMode={field.key === "postal" ? "numeric" : "text"} pattern={field.key === "postal" ? "[0-9]{5}" : optional ? undefined : ".*\\S.*"} value={values[field.key] || ""} onChange={e => update(field.key,e.target.value)} onBlur={e => { if (!e.target.validity.valid) setErrors(previous => ({...previous, [field.key]: field.key === "postal" ? "Escribe un código postal de 5 dígitos." : `Completa ${field.label.toLowerCase()}.`})); }} onInvalid={() => setErrors(previous => ({...previous,[field.key]: field.key === "postal" ? "Escribe un código postal de 5 dígitos." : `Completa ${field.label.toLowerCase()}.`}))} aria-invalid={!!errors[field.key]} aria-describedby={help || errors[field.key] ? `delivery-${field.key}-help` : undefined}/>
   {field.key === "exterior" && <button type="button" className="address-sn" onClick={() => update("exterior", "S/N")}>Usar S/N</button>}
   {(help || errors[field.key]) && <span className={errors[field.key] ? "address-error" : "address-help"} id={`delivery-${field.key}-help`}>{errors[field.key] || help}</span>}
  </div>;
 })}<div className="address-field address-field--state"><label htmlFor="delivery-state">Estado</label><select id="delivery-state" name="state" required autoComplete="shipping address-level1" value={values.state || ""} onChange={e=>update("state",e.target.value)} onInvalid={()=>setErrors(previous=>({...previous,state:"Selecciona un estado."}))} aria-invalid={!!errors.state} aria-describedby={errors.state ? "delivery-state-error" : undefined}><option value="">Selecciona tu estado</option>{STATES.map(state=><option key={state}>{state}</option>)}</select>{errors.state && <span id="delivery-state-error" className="address-error">{errors.state}</span>}</div></div>
 <h4 className="address-group-title"><span aria-hidden="true">3</span>Ayuda para encontrar tu domicilio</h4>
 <label htmlFor="delivery-references">Referencias de entrega (opcional)</label><textarea id="delivery-references" name="references" rows={2} maxLength={200} autoComplete="off" placeholder="Entre calles, color de fachada…" value={values.references || ""} onChange={e=>update("references",e.target.value)}/>
 <div className="address-preview" data-testid="address-preview"><strong>Revisa tu dirección</strong><p>{preview || "Tu dirección aparecerá aquí mientras completas los campos."}</p><small>Verifica calle, número y código postal antes de continuar.</small></div>
 </fieldset>;
}
