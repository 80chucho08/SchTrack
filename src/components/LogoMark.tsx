// Isotipo de SchTrack: un mini horario de 3x3 con algunos bloques ocupados.
interface Props {
    size?: number;
}

const celdas = [
    { x: 0, y: 0, fill: "var(--brand-cyan)" },
    { x: 1, y: 0, fill: "rgba(255,255,255,0.14)" },
    { x: 2, y: 0, fill: "var(--brand-magenta)" },
    { x: 0, y: 1, fill: "rgba(255,255,255,0.14)" },
    { x: 1, y: 1, fill: "#ffffff" },
    { x: 2, y: 1, fill: "rgba(255,255,255,0.14)" },
    { x: 0, y: 2, fill: "var(--brand-violet)" },
    { x: 1, y: 2, fill: "rgba(255,255,255,0.14)" },
    { x: 2, y: 2, fill: "var(--brand-amber)" },
];

const LogoMark = ({ size = 40 }: Props) => {
    return (
    <svg
        className="logo-mark"
        width={size}
        height={size}
        viewBox="0 0 40 40"
        aria-hidden="true"
    >
        <rect width="40" height="40" rx="11" fill="var(--space-nebula)" />
        <rect
            x="0.5"
            y="0.5"
            width="39"
            height="39"
            rx="10.5"
            fill="none"
            stroke="rgba(165,180,252,0.35)"
        />
        {celdas.map(({ x, y, fill }) => (
            <rect
                key={`${x}-${y}`}
                x={8 + x * 8.67}
                y={8 + y * 8.67}
                width="6.67"
                height="6.67"
                rx="1.8"
                fill={fill}
            />
        ))}
    </svg>
    );
};

export default LogoMark;
