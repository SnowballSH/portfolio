export const encodeEmail = (address: string): string => btoa(address);

export const decodeEmail = (encoded: string): string => atob(encoded);

export function revealEmailLinks(root: ParentNode): void {
  for (const link of root.querySelectorAll<HTMLAnchorElement>(
    "a[data-email]",
  )) {
    const address = decodeEmail(link.dataset.email ?? "");
    link.href = `mailto:${address}`;
    if (link.dataset.emailLabel === undefined) link.textContent = address;
  }
}
