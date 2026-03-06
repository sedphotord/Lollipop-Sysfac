import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lollipop — Facturación Electrónica DGII";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    display: "flex",
                    background: "linear-gradient(135deg, #0f1a2e 0%, #1a2d4a 60%, #0d2040 100%)",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Background glow orbs */}
                <div
                    style={{
                        position: "absolute",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
                        top: "-150px",
                        right: "50px",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
                        bottom: "-100px",
                        left: "200px",
                    }}
                />

                {/* LEFT SIDE */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "60px 50px 60px 70px",
                        flex: 1,
                        gap: "0px",
                    }}
                >
                    {/* Logo mark */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            marginBottom: "28px",
                        }}
                    >
                        <div
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "14px",
                                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "28px",
                                boxShadow: "0 8px 32px rgba(37,99,235,0.4)",
                            }}
                        >
                            🍭
                        </div>
                        <span
                            style={{
                                fontSize: "28px",
                                fontWeight: "800",
                                color: "#ffffff",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Lollipop
                        </span>
                    </div>

                    {/* Main title */}
                    <div
                        style={{
                            fontSize: "54px",
                            fontWeight: "800",
                            color: "#ffffff",
                            lineHeight: "1.1",
                            letterSpacing: "-1.5px",
                            marginBottom: "20px",
                        }}
                    >
                        Facturación
                        <br />
                        <span
                            style={{
                                background: "linear-gradient(90deg, #60a5fa, #818cf8)",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                            }}
                        >
                            Electrónica
                        </span>
                    </div>

                    {/* Subtitle */}
                    <div
                        style={{
                            fontSize: "20px",
                            color: "rgba(148,163,184,1)",
                            fontWeight: "400",
                            marginBottom: "32px",
                            lineHeight: "1.4",
                        }}
                    >
                        e-CF · NCF · POS · Inventario · Cotizaciones
                    </div>

                    {/* Badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <div
                            style={{
                                padding: "8px 18px",
                                borderRadius: "100px",
                                background: "rgba(37,99,235,0.2)",
                                border: "1px solid rgba(37,99,235,0.4)",
                                color: "#93c5fd",
                                fontSize: "15px",
                                fontWeight: "600",
                            }}
                        >
                            🇩🇴 República Dominicana
                        </div>
                        <div
                            style={{
                                padding: "8px 18px",
                                borderRadius: "100px",
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.3)",
                                color: "#6ee7b7",
                                fontSize: "15px",
                                fontWeight: "600",
                            }}
                        >
                            DGII Oficial
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — mini dashboard card */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "50px 60px 50px 0",
                        width: "440px",
                    }}
                >
                    <div
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "20px",
                            padding: "28px",
                            width: "340px",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        {/* Card header */}
                        <div
                            style={{
                                fontSize: "13px",
                                color: "rgba(148,163,184,0.8)",
                                fontWeight: "600",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                            }}
                        >
                            Factura Electrónica
                        </div>

                        {/* Amount */}
                        <div
                            style={{
                                fontSize: "32px",
                                fontWeight: "800",
                                color: "#ffffff",
                                letterSpacing: "-1px",
                            }}
                        >
                            RD$ 45,800.00
                        </div>

                        {/* Status */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <div
                                style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "#10b981",
                                }}
                            />
                            <span style={{ color: "#34d399", fontSize: "14px", fontWeight: "600" }}>
                                Cobrada
                            </span>
                        </div>

                        {/* Divider */}
                        <div
                            style={{
                                height: "1px",
                                background: "rgba(255,255,255,0.07)",
                            }}
                        />

                        {/* Rows */}
                        {[
                            { label: "Consultoría Software", value: "RD$ 25,000" },
                            { label: "Licencia mensual", value: "RD$ 15,000" },
                            { label: "ITBIS 18%", value: "RD$ 5,800" },
                        ].map((row) => (
                            <div
                                key={row.label}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{ color: "rgba(148,163,184,0.9)", fontSize: "13px" }}>
                                    {row.label}
                                </span>
                                <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "600" }}>
                                    {row.value}
                                </span>
                            </div>
                        ))}

                        {/* Bottom bar */}
                        <div
                            style={{
                                background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                                borderRadius: "10px",
                                padding: "12px 16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "4px",
                            }}
                        >
                            <span style={{ color: "white", fontSize: "13px", fontWeight: "700" }}>
                                TOTAL
                            </span>
                            <span style={{ color: "white", fontSize: "17px", fontWeight: "800" }}>
                                RD$ 45,800
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
