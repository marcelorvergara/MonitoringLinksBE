import axios from "axios";

export async function testUrl(url: string) {
  try {
    const result = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (
      result.status.toString().startsWith("2") ||
      result.status.toString().startsWith("3")
    ) {
      return "ok";
    } else {
      return "error";
    }
  } catch (err) {
    return "error";
  }
}
