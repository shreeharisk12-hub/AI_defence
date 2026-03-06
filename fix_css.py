import sys

file_path = '/Users/shreehariskulkarni/Desktop/AI_defence/index.html'
with open(file_path, 'r') as f:
    content = f.read()

# Replace gold colors for vibrancy
content = content.replace('#c8a84e', '#ffcc00')
content = content.replace('rgba(200, 168, 78', 'rgba(255, 204, 0')
content = content.replace('#ddc06a', '#ffcc00')

# Text readability improvements
content = content.replace('--text-secondary: #9a9486;', '--text-secondary: #c9c5b8;')
content = content.replace('--text-dim: #5c5647;', '--text-dim: #827e72;')

# Navbar hover glow
content = content.replace('border-bottom-color: var(--accent-gold);\n        }', 'border-bottom-color: var(--accent-gold);\n            text-shadow: 0 0 12px rgba(255, 204, 0, 0.6);\n        }')

# Fix spacing in sections (from 100px to 140px)
content = content.replace('padding: 100px 24px;', 'padding: 140px 24px;')

# Add contact CSS before FOOTER
contact_css = """
        /* =============================================
           CONTACT SECTION
           ============================================= */
        .contact-section {
            background: var(--bg-primary);
            padding: 140px 24px;
            border-top: 1px solid rgba(255, 204, 0, 0.08);
        }
        
        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .contact-form input,
        .contact-form textarea {
            width: 100%;
            padding: 16px;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 204, 0, 0.2);
            color: var(--text-primary);
            font-family: var(--font-body);
            font-size: 15px;
            border-radius: 4px;
            transition: border-color 0.35s, box-shadow 0.35s;
        }
        
        .contact-form input:focus,
        .contact-form textarea:focus {
            outline: none;
            border-color: var(--accent-gold);
            box-shadow: 0 0 15px rgba(255, 204, 0, 0.25);
        }

        .contact-form textarea {
            resize: vertical;
            min-height: 150px;
        }

        /* =============================================
           FOOTER"""
content = content.replace('/* =============================================\n           FOOTER', contact_css)

with open(file_path, 'w') as f:
    f.write(content)
