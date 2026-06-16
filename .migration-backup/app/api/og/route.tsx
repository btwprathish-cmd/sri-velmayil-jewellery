import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get the title from query parameters
    const title = searchParams.get("title") || "Sri Velmayil Jewellery";
    const subtitle = searchParams.get("subtitle") || "Premium Gold Jewellery Shop in Tirupur";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#0c0418",
            backgroundImage: "radial-gradient(circle at 50% 50%, #25103f 0%, #0c0418 100%)",
            padding: "80px",
            boxSizing: "border-box",
            border: "12px solid #D4AF37",
            position: "relative",
          }}
        >
          {/* Top Left decorative corner */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              width: "40px",
              height: "40px",
              borderTop: "6px solid #F3E5AB",
              borderLeft: "6px solid #F3E5AB",
            }}
          />
          {/* Bottom Right decorative corner */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              borderBottom: "6px solid #F3E5AB",
              borderRight: "6px solid #F3E5AB",
            }}
          />

          {/* Header Store Name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontFamily: "serif",
                fontWeight: "bold",
                color: "#D4AF37",
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              Sri Velmayil Jewellery
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#F3E5AB",
                letterSpacing: "8px",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              Tirupur • Tamil Nadu
            </span>
          </div>

          {/* Center Title */}
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              margin: "20px 0",
              maxWidth: "900px",
            }}
          >
            <span
              style={{
                fontSize: "56px",
                fontFamily: "serif",
                fontWeight: "extrabold",
                color: "#fbf6e8",
                lineHeight: "1.2",
              }}
            >
              {title}
            </span>
          </div>

          {/* Footer Quality Stamp */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "2px solid rgba(212, 175, 55, 0.2)",
              paddingTop: "24px",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                color: "#F3E5AB",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              {subtitle}
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#D4AF37",
                fontWeight: "bold",
                border: "1px solid #D4AF37",
                padding: "4px 12px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              BIS 916 Hallmarked • HUID
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate Open Graph Image: ${e.message}`, {
      status: 500,
    });
  }
}
