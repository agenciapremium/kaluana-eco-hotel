/** Campo invisível que humanos não preenchem. Se vier preenchido, o envio é descartado. */
export function Honeypot({ id }: { id: string }) {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor={`${id}-website`}>Site</label>
      <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
