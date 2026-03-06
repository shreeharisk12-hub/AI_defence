/**
 * detection-info.js
 * Threat Intelligence Card System
 * Displays contextual threat data when the AI model detects military objects.
 */

const THREAT_DATABASE = {
    "Anti-air Defence": {
        role: "Air denial system",
        threatLevel: "CRITICAL",
        description:
            "Long-range surface-to-air missile platform capable of engaging aircraft and incoming projectiles at high altitude. Engagement range: 40km+.",
    },
    "Battle-Tank": {
        role: "Armored assault unit",
        threatLevel: "HIGH",
        description:
            "Heavy tracked combat vehicle with composite armor and a 120mm smoothbore cannon. Capable of engaging infantry and fortified positions.",
    },
    "Logistics-Vehicle": {
        role: "Supply chain support",
        threatLevel: "MODERATE",
        description:
            "Rear-echelon resupply unit transporting fuel, ammunition, or personnel. Elimination disrupts enemy operational capacity.",
    },
    "M2A4-Slammer": {
        role: "Infantry fighting vehicle",
        threatLevel: "HIGH",
        description:
            "Amphibious IFV equipped with 25mm autocannon and anti-tank missiles. Highly mobile in urban and open terrain.",
    },
    "Mobile-Radar": {
        role: "Surveillance & targeting",
        threatLevel: "ELEVATED",
        description:
            "Deployable radar array providing real-time battlefield awareness and target acquisition for artillery or missile systems.",
    },
};

/* ── colour map for threat levels ── */
const THREAT_COLORS = {
    CRITICAL: "#ff2a2a",
    HIGH: "#ff8c00",
    ELEVATED: "#ffbf00",
    MODERATE: "#f5e642",
};

/* ── inject scoped CSS once ── */
(function injectStyles() {
    if (document.getElementById("threat-card-styles")) return;

    const style = document.createElement("style");
    style.id = "threat-card-styles";
    style.textContent = `
        .threat-card-overlay {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.55);
            animation: tcFadeIn 0.25s ease-out;
        }

        .threat-card {
            position: relative;
            width: 420px;
            max-width: 92vw;
            background: rgba(10, 14, 20, 0.95);
            border: 1px solid #2af5ff;
            padding: 28px 24px 24px;
            font-family: 'Share Tech Mono', monospace;
            color: #c8d6e5;
            box-shadow: 0 0 24px rgba(42, 245, 255, 0.15),
                         inset 0 0 60px rgba(42, 245, 255, 0.03);
        }

        .threat-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 3px;
            background: linear-gradient(90deg, transparent, #2af5ff, transparent);
        }

        .threat-card-label {
            font-size: 10px;
            letter-spacing: 3px;
            color: #556677;
            margin-bottom: 14px;
            text-transform: uppercase;
        }

        .threat-card-class {
            font-family: 'Rajdhani', sans-serif;
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 16px;
        }

        .threat-card-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid rgba(42, 245, 255, 0.08);
            font-size: 13px;
        }

        .threat-card-row span:first-child {
            color: #556677;
            letter-spacing: 1.5px;
        }

        .threat-card-desc {
            margin-top: 16px;
            font-size: 12px;
            line-height: 1.7;
            color: #8899aa;
            border-left: 2px solid rgba(42, 245, 255, 0.25);
            padding-left: 12px;
        }

        .threat-card-timer {
            position: absolute;
            bottom: 0; left: 0;
            height: 2px;
            background: #2af5ff;
            animation: tcTimer 8s linear forwards;
        }

        .threat-card-hint {
            margin-top: 18px;
            text-align: center;
            font-size: 10px;
            letter-spacing: 2px;
            color: #334455;
        }

        @keyframes tcFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        @keyframes tcTimer {
            from { width: 100%; }
            to   { width: 0%; }
        }
    `;
    document.head.appendChild(style);
})();

/**
 * showThreatCard – Display a threat intelligence popup for a detected class.
 * @param {string} detectedClass  One of the keys in THREAT_DATABASE.
 */
function showThreatCard(detectedClass) {
    const entry = THREAT_DATABASE[detectedClass];
    if (!entry) {
        console.warn(`[THREAT-INTEL] Unknown class: "${detectedClass}"`);
        return;
    }

    /* Remove any existing card first */
    const existing = document.querySelector(".threat-card-overlay");
    if (existing) existing.remove();

    const levelColor = THREAT_COLORS[entry.threatLevel] || "#ffffff";

    /* Build DOM */
    const overlay = document.createElement("div");
    overlay.className = "threat-card-overlay";
    overlay.innerHTML = `
        <div class="threat-card">
            <div class="threat-card-label">&#x26A0; threat intelligence report</div>
            <div class="threat-card-class">${detectedClass}</div>

            <div class="threat-card-row">
                <span>ROLE</span>
                <span>${entry.role.toUpperCase()}</span>
            </div>
            <div class="threat-card-row">
                <span>THREAT LEVEL</span>
                <span style="color:${levelColor}; font-weight:700;">${entry.threatLevel}</span>
            </div>

            <div class="threat-card-desc">${entry.description}</div>

            <div class="threat-card-timer"></div>
            <div class="threat-card-hint">CLICK ANYWHERE TO DISMISS</div>
        </div>
    `;

    document.body.appendChild(overlay);

    /* Dismiss on click */
    overlay.addEventListener("click", () => overlay.remove());

    /* Auto-dismiss after 8 seconds */
    setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
    }, 8000);
}

/* ── Export for module-based pipelines ── */
if (typeof module !== "undefined" && module.exports) {
    module.exports = { THREAT_DATABASE, showThreatCard };
}
