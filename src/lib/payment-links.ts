const links: Readonly<Record<number, string>> = {
  1: "https://mpago.la/2xwcTmy",
  2: "https://mpago.la/2SpociY",
  3: "https://mpago.la/1tGZvcR",
  4: "https://mpago.la/2BeYgHo",
  5: "https://mpago.la/26aMKHf",
};

export function paymentQuote(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) return null;
  const subtotal = quantity * 199;
  const shipping = quantity < 3 ? 199 : 0;
  return { subtotal, shipping, total: subtotal + shipping, href: links[quantity] };
}
