export function parseFigmaUrl(
  url: string
): { key: string; title: string } | null {
  if (!url) {
    return null;
  }

  const match = url.match(
    /https:\/\/www\.figma\.com\/file\/([A-z|\d]+)\/([a-zA-Z|\-|_|\d]+)(\?.*)?/
  );

  if (match) {
    return {
      key: match[1],
      title: match[2],
    };
  }

  return null;
}
