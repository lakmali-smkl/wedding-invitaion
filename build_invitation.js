const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Royal Wedding Invitation — Kaveesha &amp; Shanshana</title>
  <meta name="description" content="You are cordially invited to the royal wedding celebration of Kaveesha and Shanshana at Watersage Hotel, January 15, 2027." />
  
  <!-- Google Fonts: Royal serif & romantic calligraphy -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Great+Vibes&family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet" />

  <style>
    /* CSS Reset & Variables */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    :root {
      --gold-primary: #d4af37;
      --gold-light: #fae69e;
      --gold-dark: #8c6a1e;
      --gold-metallic: linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%);
      --gold-border: linear-gradient(45deg, #c9a96e, #f7e7b4, #b2872a, #f9ebb9);
      --royal-red: #580b14;
      --royal-burgundy: #2a080c;
      --royal-deep: #0b0607;
      --bg-dark: #080405;
      --ivory-cream: #fdfbf7;
      --parchment: #f6eedb;
      --text-dark: #20130d;
      --text-muted: #5e4638;
      --shadow-royal: 0 25px 60px rgba(0, 0, 0, 0.85);
    }

    body {
      width: 100vw;
      min-height: 100vh;
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(circle at 50% 20%, rgba(88, 11, 20, 0.25) 0%, transparent 60%),
        radial-gradient(circle at 50% 80%, rgba(180, 130, 40, 0.12) 0%, transparent 70%);
      color: #fdfbf7;
      font-family: 'Montserrat', sans-serif;
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;
    }

    /* Ambient Music Toggle */
    .music-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(20, 10, 10, 0.7);
      border: 1px solid rgba(212, 175, 55, 0.6);
      color: var(--gold-light);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      transition: all 0.3s ease;
    }
    .music-btn:hover {
      transform: scale(1.08);
      border-color: var(--gold-light);
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
    }
    .music-btn.playing {
      animation: musicPulse 2s infinite ease-in-out;
    }
    @keyframes musicPulse {
      0%, 100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
      50% { box-shadow: 0 0 22px rgba(212, 175, 55, 0.8); }
    }

    /* Particles & Petals Canvas */
    #ambient-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }

    /* Royal Corner Ornaments */
    .corner-ornament {
      position: fixed;
      width: 80px;
      height: 80px;
      pointer-events: none;
      z-index: 99;
      opacity: 0.6;
      filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.4));
      transition: opacity 0.5s ease;
    }
    .co-top-left { top: 12px; left: 12px; }
    .co-top-right { top: 12px; right: 12px; transform: scaleX(-1); }
    .co-bottom-left { bottom: 12px; left: 12px; transform: scaleY(-1); }
    .co-bottom-right { bottom: 12px; right: 12px; transform: scale(-1, -1); }

    /* Scene Container */
    .scene-viewport {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      z-index: 10;
    }

    /* Sections / States */
    .section-view {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .section-view.hidden-view {
      display: none !important;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.95);
    }

    /* =========================================================
       STAGE 1: THE ROYAL ENVELOPE (FIRST VIEW)
       ========================================================= */
    .envelope-master-wrapper {
      position: relative;
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .royal-badge-top {
      font-family: 'Cinzel', serif;
      font-size: 0.72rem;
      letter-spacing: 0.35em;
      color: var(--gold-light);
      text-transform: uppercase;
      margin-bottom: 18px;
      text-shadow: 0 0 12px rgba(212, 175, 55, 0.6);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .royal-badge-top::before, .royal-badge-top::after {
      content: '';
      width: 32px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold-light));
    }
    .royal-badge-top::after {
      background: linear-gradient(90deg, var(--gold-light), transparent);
    }

    /* Envelope Container */
    .envelope-outer {
      position: relative;
      width: 100%;
      height: 320px;
      perspective: 1200px;
      margin: 10px auto 26px;
      cursor: pointer;
    }

    .envelope-body {
      position: absolute;
      inset: 0;
      background: linear-gradient(145deg, #380d12 0%, #200508 100%);
      border-radius: 12px;
      border: 1.5px solid rgba(212, 175, 55, 0.5);
      box-shadow: 
        0 15px 40px rgba(0, 0, 0, 0.85),
        inset 0 0 35px rgba(0,0,0,0.7),
        0 0 25px rgba(212, 175, 55, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 24px;
    }

    /* Ornate envelope borders */
    .envelope-inner-border {
      position: absolute;
      inset: 10px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 8px;
      pointer-events: none;
    }

    .envelope-tri-left {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 50%;
      border-style: solid;
      border-width: 160px 0 160px 240px;
      border-color: transparent transparent transparent rgba(42, 8, 12, 0.7);
      pointer-events: none;
    }
    .envelope-tri-right {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 50%;
      border-style: solid;
      border-width: 160px 240px 160px 0;
      border-color: transparent rgba(35, 6, 10, 0.8) transparent transparent;
      pointer-events: none;
    }
    .envelope-tri-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-style: solid;
      border-width: 0 240px 170px 240px;
      border-color: transparent transparent rgba(50, 11, 16, 0.95) transparent;
      pointer-events: none;
    }

    /* Envelope Top Flap with 3D folding */
    .envelope-flap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 165px;
      transform-origin: top center;
      transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 5;
      pointer-events: none;
    }
    .envelope-flap-inner {
      width: 100%;
      height: 100%;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      background: linear-gradient(180deg, #4d1017 0%, #29060a 100%);
      border-top: 1.5px solid rgba(212, 175, 55, 0.7);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7);
      position: relative;
    }
    .envelope-flap-inner::after {
      content: '';
      position: absolute;
      inset: 4px;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      border-top: 1px solid rgba(212, 175, 55, 0.35);
    }

    .envelope-outer.opened .envelope-flap {
      transform: rotateX(180deg);
      z-index: 1;
    }

    /* Parchment Card Peeking Out */
    .envelope-peek-card {
      position: absolute;
      bottom: 25px;
      left: 20px;
      right: 20px;
      height: 240px;
      background: linear-gradient(135deg, #fbf7ee 0%, #efe4ce 100%);
      border-radius: 8px;
      border: 1px solid rgba(212, 175, 55, 0.6);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      transform: translateY(0);
      transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s, opacity 0.8s ease;
    }
    .envelope-outer.opened .envelope-peek-card {
      transform: translateY(-120px) scale(1.05);
      opacity: 0;
    }

    /* Guest Name Tag on Front of Envelope */
    .envelope-guest-tag {
      position: relative;
      z-index: 4;
      background: rgba(18, 6, 8, 0.85);
      border: 1px solid rgba(212, 175, 55, 0.6);
      border-radius: 6px;
      padding: 12px 18px;
      width: 88%;
      margin: 0 auto 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(6px);
    }
    .tag-label {
      font-family: 'Cinzel', serif;
      font-size: 0.62rem;
      letter-spacing: 0.28em;
      color: var(--gold-light);
      text-transform: uppercase;
      opacity: 0.9;
      display: block;
      margin-bottom: 4px;
    }
    .guest-input-field {
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 1px dashed rgba(212, 175, 55, 0.5);
      color: #fff;
      font-family: 'Great Vibes', cursive;
      font-size: 1.65rem;
      text-align: center;
      outline: none;
      padding: 2px 8px;
      transition: border-color 0.3s;
    }
    .guest-input-field:focus {
      border-bottom-color: var(--gold-light);
    }
    .guest-input-field::placeholder {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.05rem;
      color: rgba(250, 230, 158, 0.45);
    }

    /* Wax Seal Button */
    .wax-seal-btn {
      position: absolute;
      top: 145px;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 82px;
      height: 82px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #b31625 0%, #680b14 60%, #3a040a 100%);
      border: 2px solid rgba(212, 175, 55, 0.7);
      box-shadow: 
        0 8px 25px rgba(0, 0, 0, 0.8),
        0 0 20px rgba(179, 22, 37, 0.5),
        inset 0 0 10px rgba(0, 0, 0, 0.6);
      cursor: pointer;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      animation: sealGlow 2.5s infinite ease-in-out;
    }
    .wax-seal-btn:hover {
      transform: translate(-50%, -50%) scale(1.08);
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.9),
        0 0 35px rgba(212, 175, 55, 0.8);
    }
    @keyframes sealGlow {
      0%, 100% {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);
      }
      50% {
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.9), 0 0 28px rgba(212, 175, 55, 0.85);
      }
    }
    .wax-seal-monogram {
      font-family: 'Cinzel Decorative', 'Cinzel', serif;
      font-size: 1.55rem;
      font-weight: 700;
      color: var(--gold-light);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(250, 230, 158, 0.6);
      line-height: 1;
    }
    .wax-seal-sub {
      font-family: 'Cinzel', serif;
      font-size: 0.45rem;
      letter-spacing: 0.2em;
      color: rgba(250, 230, 158, 0.8);
      margin-top: 2px;
    }

    .open-prompt {
      margin-top: 14px;
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.15rem;
      color: var(--gold-light);
      letter-spacing: 0.08em;
      opacity: 0.85;
      animation: gentleFloat 2.5s ease-in-out infinite;
    }
    @keyframes gentleFloat {
      0%, 100% { transform: translateY(0); opacity: 0.7; }
      50% { transform: translateY(-4px); opacity: 1; }
    }

    /* Quick Preset Guest Names */
    .preset-names-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
    }
    .preset-chip {
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: rgba(250, 230, 158, 0.8);
      font-size: 0.7rem;
      font-family: 'Cinzel', serif;
      letter-spacing: 0.05em;
      padding: 5px 12px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .preset-chip:hover {
      background: rgba(212, 175, 55, 0.25);
      border-color: var(--gold-light);
      color: #fff;
    }


    /* =========================================================
       STAGE 2 & 3: ROYAL COUPLE PORTRAIT & NAMES REVEAL
       ========================================================= */
    .portrait-stage {
      position: relative;
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .portrait-crown-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
    }
    .crown-icon {
      width: 38px;
      height: 38px;
      color: var(--gold-light);
      filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.6));
    }
    .portrait-subhead {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      letter-spacing: 0.38em;
      color: var(--gold-light);
      text-transform: uppercase;
      opacity: 0.9;
    }

    /* Ornate Baroque Photo Frame */
    .photo-frame-master {
      position: relative;
      width: 100%;
      border-radius: 18px;
      padding: 10px;
      background: linear-gradient(135deg, #c59741 0%, #f9e8a2 30%, #8c6a1e 70%, #d4af37 100%);
      box-shadow: 
        0 25px 60px rgba(0, 0, 0, 0.95),
        0 0 35px rgba(212, 175, 55, 0.35);
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }
    .photo-frame-master:hover {
      transform: translateY(-3px) scale(1.01);
      box-shadow: 
        0 30px 70px rgba(0, 0, 0, 1),
        0 0 45px rgba(212, 175, 55, 0.55);
    }

    .photo-inner-canvas {
      position: relative;
      width: 100%;
      height: 480px;
      border-radius: 12px;
      overflow: hidden;
      background-color: #0b0607;
    }

    /* The actual couple photo */
    .couple-image-element {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 25%;
      display: block;
      filter: contrast(1.05) brightness(1.02);
      transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .photo-frame-master:hover .couple-image-element {
      transform: scale(1.03);
    }

    /* Subtle Vignette on Image */
    .photo-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 40%, transparent 45%, rgba(10, 4, 6, 0.75) 100%);
      pointer-events: none;
    }

    /* Shimmer light sweep across photo */
    .photo-shimmer-fx {
      position: absolute;
      inset: -50%;
      background: linear-gradient(
        45deg, 
        transparent 40%, 
        rgba(255, 255, 255, 0.15) 50%, 
        transparent 60%
      );
      transform: rotate(25deg);
      animation: lightSweep 6s infinite linear;
      pointer-events: none;
    }
    @keyframes lightSweep {
      0% { transform: translateY(-100%) rotate(25deg); }
      100% { transform: translateY(100%) rotate(25deg); }
    }

    /* Touch to Reveal Overlay / Indicator (Stage 2) */
    .touch-cue-wrapper {
      position: absolute;
      bottom: 24px;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      z-index: 15;
      transition: opacity 0.6s ease, transform 0.6s ease;
      pointer-events: none;
    }
    .touch-cue-wrapper.faded-out {
      opacity: 0;
      transform: translateY(20px);
    }

    .touch-pulse-ring {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: rgba(18, 6, 8, 0.7);
      border: 1.5px solid var(--gold-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gold-light);
      font-size: 1.5rem;
      backdrop-filter: blur(6px);
      box-shadow: 0 0 25px rgba(212, 175, 55, 0.6);
      animation: touchPulse 2s infinite ease-in-out;
    }
    @keyframes touchPulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 0 16px rgba(212, 175, 55, 0);
        transform: scale(1.08);
      }
    }

    .touch-cue-text {
      font-family: 'Cinzel', serif;
      font-size: 0.72rem;
      letter-spacing: 0.25em;
      color: #fff;
      text-transform: uppercase;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9), 0 0 12px rgba(212, 175, 55, 0.8);
      background: rgba(18, 6, 8, 0.6);
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid rgba(212, 175, 55, 0.4);
    }

    /* Names Banner Revealed (Stage 3) */
    .names-scrim-reveal {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(10, 3, 5, 0.94) 0%,
        rgba(10, 3, 5, 0.7) 45%,
        transparent 80%
      );
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 30px 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1);
      z-index: 10;
    }
    .names-scrim-reveal.active-revealed {
      opacity: 1;
      pointer-events: all;
    }

    .couple-title-script {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(2.6rem, 9vw, 3.8rem);
      line-height: 1.05;
      color: #fff;
      text-shadow: 
        0 2px 15px rgba(0, 0, 0, 0.9),
        0 0 25px rgba(212, 175, 55, 0.8),
        0 0 50px rgba(212, 175, 55, 0.4);
      letter-spacing: 0.02em;
    }
    .names-ampersand {
      font-family: 'Alex Brush', cursive;
      font-size: 2.2rem;
      color: var(--gold-light);
      margin: -6px 0;
      display: block;
      text-shadow: 0 0 15px rgba(212, 175, 55, 0.7);
    }
    .couple-tagline {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.15rem;
      color: var(--gold-light);
      letter-spacing: 0.12em;
      margin-top: 4px;
      opacity: 0.95;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    }

    /* Proceed to Invitation Details Button */
    .proceed-details-btn {
      margin-top: 24px;
      background: linear-gradient(135deg, #c59741 0%, #f9e8a2 50%, #b88628 100%);
      color: #1a0805;
      border: none;
      padding: 14px 34px;
      border-radius: 30px;
      font-family: 'Cinzel', serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 
        0 8px 30px rgba(0, 0, 0, 0.6),
        0 0 25px rgba(212, 175, 55, 0.6);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(15px);
    }
    .names-scrim-reveal.active-revealed .proceed-details-btn {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s, box-shadow 0.3s;
    }
    .proceed-details-btn:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 
        0 12px 35px rgba(0, 0, 0, 0.7),
        0 0 35px rgba(212, 175, 55, 0.9);
    }


    /* =========================================================
       STAGE 4: FULL ROYAL INVITATION CARD & DETAILS
       ========================================================= */
    .royal-scroll-card {
      position: relative;
      width: 100%;
      max-width: 580px;
      background: #fcf9f2;
      color: var(--text-dark);
      border-radius: 12px;
      box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.9),
        0 0 0 1px rgba(212, 175, 55, 0.6),
        0 0 45px rgba(212, 175, 55, 0.25);
      overflow: hidden;
      margin: 10px auto 40px;
      animation: cardEmerge 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    @keyframes cardEmerge {
      from { opacity: 0; transform: translateY(40px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Gold scroll top header */
    .scroll-header-decor {
      background: linear-gradient(145deg, #2b080d 0%, #160305 100%);
      color: #fff;
      padding: 38px 24px 28px;
      text-align: center;
      position: relative;
      border-bottom: 2px solid var(--gold-primary);
    }
    .scroll-header-decor::before {
      content: '';
      position: absolute;
      inset: 8px;
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 6px;
      pointer-events: none;
    }

    .scroll-crest {
      font-size: 1.8rem;
      color: var(--gold-light);
      margin-bottom: 8px;
      filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.6));
    }
    .scroll-top-subtitle {
      font-family: 'Cinzel', serif;
      font-size: 0.68rem;
      letter-spacing: 0.35em;
      color: var(--gold-light);
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 12px;
    }

    /* Guest Dedication Ribbon */
    .guest-honor-banner {
      background: rgba(212, 175, 55, 0.12);
      border-top: 1px solid rgba(212, 175, 55, 0.3);
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
      padding: 14px 20px;
      margin: 14px 0 18px;
    }
    .guest-prefix-text {
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.28em;
      color: var(--gold-light);
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
    }
    .guest-name-showcase {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(2rem, 6.5vw, 2.8rem);
      color: #fff;
      text-shadow: 0 0 18px rgba(212, 175, 55, 0.6);
      line-height: 1.1;
    }

    .scroll-announcement-text {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.12rem;
      color: rgba(250, 230, 158, 0.9);
      line-height: 1.6;
      max-width: 440px;
      margin: 0 auto;
    }

    /* Royal Couple Highlight in Card */
    .scroll-couple-names {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(2.8rem, 8vw, 3.6rem);
      color: var(--gold-light);
      line-height: 1.1;
      margin: 16px 0;
      text-shadow: 0 0 25px rgba(212, 175, 55, 0.5);
    }
    .scroll-couple-names span {
      font-family: 'Alex Brush', cursive;
      font-size: 2.2rem;
      display: block;
      margin: -8px 0;
      color: #fff;
    }

    /* Card Content Body */
    .scroll-card-body {
      padding: 32px 24px;
      background: 
        radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%),
        #fcf9f2;
    }

    /* Romantic Quote */
    .royal-quote-box {
      border-left: 3px solid var(--gold-primary);
      background: rgba(212, 175, 55, 0.08);
      padding: 14px 18px;
      margin-bottom: 28px;
      border-radius: 0 8px 8px 0;
      text-align: left;
    }
    .quote-text {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--text-dark);
    }
    .quote-author {
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: var(--gold-dark);
      display: block;
      margin-top: 6px;
      text-transform: uppercase;
    }

    /* Event Modules Grid */
    .info-block-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 18px 0;
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    }
    .info-block-item:last-child {
      border-bottom: none;
    }

    .info-icon-badge {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c59741 0%, #8c6a1e 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 15px rgba(140, 106, 30, 0.35);
      font-size: 1.3rem;
    }

    .info-content {
      flex: 1;
      text-align: left;
    }
    .info-meta-label {
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--gold-dark);
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .info-main-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--text-dark);
      line-height: 1.2;
      margin-bottom: 4px;
    }
    .info-desc-text {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .info-desc-text strong {
      color: var(--text-dark);
    }

    /* Venue Special Button */
    .venue-map-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: var(--gold-dark);
      padding: 6px 14px;
      border-radius: 20px;
      font-family: 'Cinzel', serif;
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .venue-map-link:hover {
      background: var(--gold-primary);
      color: #fff;
    }

    /* Parents Section Grid */
    .parents-royalty-box {
      margin: 24px 0;
      padding: 20px;
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 8px;
      text-align: center;
    }
    .parents-box-heading {
      font-family: 'Cinzel', serif;
      font-size: 0.72rem;
      letter-spacing: 0.3em;
      color: var(--gold-dark);
      text-transform: uppercase;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .parents-box-heading::before, .parents-box-heading::after {
      content: '';
      width: 24px;
      height: 1px;
      background: var(--gold-dark);
      opacity: 0.4;
    }

    .parents-two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 480px) {
      .parents-two-col {
        grid-template-columns: 1fr;
      }
    }
    .parent-card-cell {
      background: #fff;
      padding: 14px;
      border-radius: 6px;
      border: 1px solid rgba(212, 175, 55, 0.2);
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .parent-role {
      font-family: 'Cinzel', serif;
      font-size: 0.62rem;
      letter-spacing: 0.18em;
      color: var(--gold-dark);
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .parent-names {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.22rem;
      font-weight: 700;
      color: var(--text-dark);
      line-height: 1.3;
    }
    .parent-relation-note {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Countdown Timer */
    .countdown-section-wrap {
      margin: 28px 0;
      padding: 22px 16px;
      background: linear-gradient(135deg, #2b080d 0%, #160305 100%);
      border-radius: 8px;
      color: #fff;
      text-align: center;
      border: 1px solid rgba(212, 175, 55, 0.4);
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .countdown-title {
      font-family: 'Cinzel', serif;
      font-size: 0.68rem;
      letter-spacing: 0.35em;
      color: var(--gold-light);
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .countdown-grid {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }
    .cd-block {
      min-width: 58px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(212, 175, 55, 0.3);
      padding: 8px 6px;
      border-radius: 6px;
    }
    .cd-digits {
      font-family: 'Cinzel', serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--gold-light);
      line-height: 1;
      display: block;
    }
    .cd-unit-text {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.58rem;
      letter-spacing: 0.2em;
      color: rgba(250, 230, 158, 0.75);
      text-transform: uppercase;
      margin-top: 4px;
      display: block;
    }
    .cd-colon {
      font-family: 'Cinzel', serif;
      font-size: 1.4rem;
      color: var(--gold-light);
      opacity: 0.6;
      margin-top: -10px;
    }

    /* Dress Code Badges */
    .dresscode-chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    .dress-chip {
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid rgba(212, 175, 55, 0.3);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      color: var(--text-dark);
      font-family: 'Cormorant Garamond', serif;
      font-weight: 600;
      font-style: italic;
    }

    /* Actions & RSVP Footer */
    .card-actions-footer {
      background: linear-gradient(180deg, #180508 0%, #0d0203 100%);
      color: #fff;
      padding: 34px 24px;
      text-align: center;
      border-top: 2px solid var(--gold-primary);
    }
    .rsvp-header-call {
      font-family: 'Great Vibes', cursive;
      font-size: 2.4rem;
      color: var(--gold-light);
      margin-bottom: 4px;
    }
    .rsvp-sub-call {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.05rem;
      color: rgba(250, 230, 158, 0.8);
      margin-bottom: 22px;
    }

    .action-buttons-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 380px;
      margin: 0 auto;
    }

    .btn-rsvp-gold {
      background: linear-gradient(135deg, #c59741 0%, #f9e8a2 50%, #b88628 100%);
      color: #1a0805;
      padding: 14px 24px;
      border-radius: 30px;
      font-family: 'Cinzel', serif;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
    }
    .btn-rsvp-gold:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(212, 175, 55, 0.7);
    }

    .btn-action-outline {
      background: transparent;
      border: 1px solid rgba(212, 175, 55, 0.5);
      color: var(--gold-light);
      padding: 12px 20px;
      border-radius: 30px;
      font-family: 'Cinzel', serif;
      font-size: 0.72rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-action-outline:hover {
      background: rgba(212, 175, 55, 0.15);
      border-color: var(--gold-light);
      color: #fff;
    }

    /* Wishes Box Modal / Section */
    .wishes-quick-box {
      margin-top: 24px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 8px;
      text-align: center;
    }
    .wishes-title {
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--gold-light);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .wishes-input {
      width: 100%;
      height: 65px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 6px;
      padding: 8px 12px;
      color: #fff;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.05rem;
      resize: none;
      outline: none;
    }
    .wishes-input:focus {
      border-color: var(--gold-light);
    }
    .send-wish-btn {
      margin-top: 8px;
      background: rgba(212, 175, 55, 0.2);
      border: 1px solid var(--gold-primary);
      color: var(--gold-light);
      padding: 6px 18px;
      border-radius: 20px;
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .send-wish-btn:hover {
      background: var(--gold-primary);
      color: #120406;
    }

    .replay-experience-link {
      display: inline-block;
      margin-top: 26px;
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: rgba(250, 230, 158, 0.5);
      text-transform: uppercase;
      cursor: pointer;
      text-decoration: underline;
      transition: color 0.3s;
    }
    .replay-experience-link:hover {
      color: var(--gold-light);
    }

    /* Screen Flash FX for Smooth Transitions */
    .screen-flash-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at center, rgba(250, 230, 158, 0.95), #0b0607);
      z-index: 99999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
    }
    .screen-flash-overlay.active {
      opacity: 1;
      pointer-events: all;
    }

    /* Confetti Burst Elements */
    .celebration-burst {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
    }
    .confetti-chip {
      position: absolute;
      border-radius: 2px;
      animation: chipFloat 1.8s ease-out forwards;
    }
    @keyframes chipFloat {
      0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.3);
        opacity: 0;
      }
    }
  </style>
</head>
<body>

  <!-- Ambient Audio Button (Web Audio API Synthesized Harp Melodies) -->
  <button class="music-btn" id="musicToggleBtn" title="Toggle Royal Wedding Harp Melody" aria-label="Play royal melody">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  </button>

  <!-- Ambient Canvas for Gold Dust and Silk Petals -->
  <canvas id="ambient-canvas"></canvas>

  <!-- Screen Flash for magical scene transitions -->
  <div class="screen-flash-overlay" id="flashOverlay"></div>

  <!-- Royal Baroque Corner Filigree Ornaments -->
  <svg class="corner-ornament co-top-left" viewBox="0 0 100 100" fill="none">
    <path d="M4 4 L4 55 M4 4 L55 4" stroke="#d4af37" stroke-width="2"/>
    <path d="M4 25 C25 4 4 25 35 35 C25 4 35 25 4 35" stroke="#f9e8a2" stroke-width="1.2" fill="none"/>
    <circle cx="4" cy="4" r="3.5" fill="#d4af37"/>
    <circle cx="28" cy="28" r="2" fill="#d4af37"/>
  </svg>
  <svg class="corner-ornament co-top-right" viewBox="0 0 100 100" fill="none">
    <path d="M4 4 L4 55 M4 4 L55 4" stroke="#d4af37" stroke-width="2"/>
    <path d="M4 25 C25 4 4 25 35 35 C25 4 35 25 4 35" stroke="#f9e8a2" stroke-width="1.2" fill="none"/>
    <circle cx="4" cy="4" r="3.5" fill="#d4af37"/>
    <circle cx="28" cy="28" r="2" fill="#d4af37"/>
  </svg>
  <svg class="corner-ornament co-bottom-left" viewBox="0 0 100 100" fill="none">
    <path d="M4 4 L4 55 M4 4 L55 4" stroke="#d4af37" stroke-width="2"/>
    <path d="M4 25 C25 4 4 25 35 35 C25 4 35 25 4 35" stroke="#f9e8a2" stroke-width="1.2" fill="none"/>
    <circle cx="4" cy="4" r="3.5" fill="#d4af37"/>
    <circle cx="28" cy="28" r="2" fill="#d4af37"/>
  </svg>
  <svg class="corner-ornament co-bottom-right" viewBox="0 0 100 100" fill="none">
    <path d="M4 4 L4 55 M4 4 L55 4" stroke="#d4af37" stroke-width="2"/>
    <path d="M4 25 C25 4 4 25 35 35 C25 4 35 25 4 35" stroke="#f9e8a2" stroke-width="1.2" fill="none"/>
    <circle cx="4" cy="4" r="3.5" fill="#d4af37"/>
    <circle cx="28" cy="28" r="2" fill="#d4af37"/>
  </svg>

  <!-- Main Viewport -->
  <main class="scene-viewport">

    <!-- =========================================================
         STAGE 1: THE ROYAL ENVELOPE (FIRST VIEW)
         ========================================================= -->
    <section class="section-view" id="stageEnvelope">
      <div class="envelope-master-wrapper">
        
        <p class="royal-badge-top">&#10022; Royal Wedding Invitation &#10022;</p>

        <!-- The 3D Interactive Envelope -->
        <div class="envelope-outer" id="envelopeInteractiveWrap" title="Click wax seal to open">
          
          <!-- Top folding flap with 3D rotation -->
          <div class="envelope-flap">
            <div class="envelope-flap-inner"></div>
          </div>

          <!-- The main envelope body -->
          <div class="envelope-body">
            <div class="envelope-inner-border"></div>
            <div class="envelope-tri-left"></div>
            <div class="envelope-tri-right"></div>
            <div class="envelope-tri-bottom"></div>

            <!-- Guest Name Plate on front of envelope -->
            <div class="envelope-guest-tag" onclick="event.stopPropagation()">
              <span class="tag-label">&#10022; To Our Esteemed Guest &#10022;</span>
              <input 
                type="text" 
                class="guest-input-field" 
                id="envelopeGuestInput" 
                placeholder="Enter Your Name Here" 
                value=""
                autocomplete="off"
                spellcheck="false"
              />
            </div>
          </div>

          <!-- Peeking Letter inside envelope -->
          <div class="envelope-peek-card">
            <p style="font-family:'Cinzel',serif;font-size:0.6rem;letter-spacing:0.3em;color:var(--gold-dark);text-transform:uppercase;margin-bottom:6px;">Sacred Nuptials</p>
            <h2 style="font-family:'Great Vibes',cursive;font-size:2.2rem;color:#8c6a1e;line-height:1;">Kaveesha &amp; Shanshana</h2>
            <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:0.95rem;color:#5e4638;margin-top:6px;">January 15, 2027 &bull; Watersage Hotel</p>
          </div>

          <!-- Crimson & Gold Wax Seal Button -->
          <div class="wax-seal-btn" id="waxSealBtn">
            <span class="wax-seal-monogram">K&amp;S</span>
            <span class="wax-seal-sub">2027</span>
          </div>

        </div>

        <p class="open-prompt">&#10022; Tap the Royal Wax Seal to Unfold &#10022;</p>

        <!-- Preset Quick Guest Name Chips for testing/convenience -->
        <div class="preset-names-row">
          <span class="preset-chip" onclick="setGuestName('Dear Friend & Family')">Family &amp; Friends</span>
          <span class="preset-chip" onclick="setGuestName('Mr. &amp; Mrs. Perera')">Mr. &amp; Mrs. Perera</span>
          <span class="preset-chip" onclick="setGuestName('Honored Guest')">Honored Guest</span>
        </div>

      </div>
    </section>


    <!-- =========================================================
         STAGE 2 & 3: ROYAL COUPLE PORTRAIT & NAMES REVEAL
         ========================================================= -->
    <section class="section-view hidden-view" id="stagePortrait">
      <div class="portrait-stage">
        
        <div class="portrait-crown-badge">
          <svg class="crown-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
          </svg>
          <span class="portrait-subhead">&#10022; The Royal Couple &#10022;</span>
        </div>

        <!-- Opulent Baroque Gold Frame with the Real Couple Photo -->
        <div class="photo-frame-master" id="couplePortraitFrame">
          <div class="photo-inner-canvas">
            
            <!-- Real Couple Photo -->
            <img 
              src="couple.jpg" 
              alt="Kaveesha and Shanshana - Royal Wedding Couple" 
              class="couple-image-element" 
              id="coupleImage" 
            />

            <!-- Vignette & Light Shimmer -->
            <div class="photo-vignette"></div>
            <div class="photo-shimmer-fx"></div>

            <!-- STAGE 2 CUE: Touch photo to unveil -->
            <div class="touch-cue-wrapper" id="touchPromptWrapper">
              <div class="touch-pulse-ring">
                &#10024;
              </div>
              <span class="touch-cue-text">Touch to Reveal Names</span>
            </div>

            <!-- STAGE 3 REVEAL: Names appear in flowing calligraphy -->
            <div class="names-scrim-reveal" id="namesRevealOverlay">
              <h1 class="couple-title-script">
                Kaveesha
                <span class="names-ampersand">&amp;</span>
                Shanshana
              </h1>
              <p class="couple-tagline">"Two Souls United as One in Eternal Love"</p>

              <button class="proceed-details-btn" id="proceedDetailsBtn">
                <span>View Wedding Details</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>


    <!-- =========================================================
         STAGE 4: FULL ROYAL INVITATION CARD & GUEST DETAILS
         ========================================================= -->
    <section class="section-view hidden-view" id="stageDetails">
      <div class="royal-scroll-card">
        
        <!-- Header Banner -->
        <div class="scroll-header-decor">
          <div class="scroll-crest">&#9813;</div>
          <p class="scroll-top-subtitle">&#10022; Royal Nuptial Celebration &#10022;</p>
          
          <div class="guest-honor-banner">
            <span class="guest-prefix-text">With Highest Regard &amp; Honor, Presented To:</span>
            <div class="guest-name-showcase" id="displayGuestName">Our Esteemed Guest</div>
          </div>

          <p class="scroll-announcement-text">
            Together with their parents, joyfully request the pleasure of your gracious company at the sacred wedding celebration of
          </p>

          <div class="scroll-couple-names">
            Kaveesha
            <span>&amp;</span>
            Shanshana
          </div>

          <p style="font-family:'Cinzel',serif;font-size:0.75rem;letter-spacing:0.25em;color:var(--gold-light);text-transform:uppercase;">
            Friday &bull; 15th January 2027
          </p>
        </div>

        <!-- Body Details -->
        <div class="scroll-card-body">
          
          <!-- Romantic Blessing -->
          <div class="royal-quote-box">
            <p class="quote-text">
              &ldquo;Two hearts that beat in sacred harmony, embarking upon a lifetime journey of boundless devotion, happiness, and timeless grace.&rdquo;
            </p>
            <span class="quote-author">&#8212; A Traditional Blessing for Kaveesha &amp; Shanshana</span>
          </div>

          <!-- Venue Section -->
          <div class="info-block-item">
            <div class="info-icon-badge">&#127963;</div>
            <div class="info-content">
              <span class="info-meta-label">The Venue</span>
              <h2 class="info-main-title">Watersage Hotel</h2>
              <p class="info-desc-text">
                An enchanting sanctuary of luxury and heritage, setting the majestic stage for our royal celebration.
              </p>
              <a 
                href="https://www.google.com/maps/search/Watersage+Hotel" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="venue-map-link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>View on Google Maps</span>
              </a>
            </div>
          </div>

          <!-- Date & Ceremony Schedule -->
          <div class="info-block-item">
            <div class="info-icon-badge">&#128197;</div>
            <div class="info-content">
              <span class="info-meta-label">Date &amp; Auspicious Timings</span>
              <h3 class="info-main-title">Friday, January 15, 2027</h3>
              <p class="info-desc-text">
                <strong>10:00 AM</strong> &mdash; Auspicious Poruwa Ceremony &amp; Sacred Traditional Rites<br/>
                <strong>12:30 PM</strong> &mdash; Royal Luncheon &amp; Toast to the Newlyweds<br/>
                <strong>06:30 PM</strong> &mdash; Grand Evening Reception &amp; Celebratory Dinner
              </p>
            </div>
          </div>

          <!-- Honored Parents Section -->
          <div class="parents-royalty-box">
            <h4 class="parents-box-heading">&#10022; Blessed By Their Parents &#10022;</h4>
            <div class="parents-two-col">
              
              <div class="parent-card-cell">
                <p class="parent-role">Bride's Parents</p>
                <p class="parent-names">Mr. &amp; Mrs. Ekanayake</p>
                <p class="parent-relation-note">Parents of Kaveesha</p>
              </div>

              <div class="parent-card-cell">
                <p class="parent-role">Groom's Parents</p>
                <p class="parent-names">Mr. &amp; Mrs. Samanayake</p>
                <p class="parent-relation-note">Parents of Shanshana</p>
              </div>

            </div>
          </div>

          <!-- Countdown Timer Section -->
          <div class="countdown-section-wrap">
            <p class="countdown-title">&#10022; Counting Down to the Auspicious Day &#10022;</p>
            <div class="countdown-grid">
              <div class="cd-block">
                <span class="cd-digits" id="cdDays">00</span>
                <span class="cd-unit-text">Days</span>
              </div>
              <span class="cd-colon">:</span>
              <div class="cd-block">
                <span class="cd-digits" id="cdHours">00</span>
                <span class="cd-unit-text">Hours</span>
              </div>
              <span class="cd-colon">:</span>
              <div class="cd-block">
                <span class="cd-digits" id="cdMins">00</span>
                <span class="cd-unit-text">Mins</span>
              </div>
              <span class="cd-colon">:</span>
              <div class="cd-block">
                <span class="cd-digits" id="cdSecs">00</span>
                <span class="cd-unit-text">Secs</span>
              </div>
            </div>
          </div>

          <!-- Dress Code Section -->
          <div class="info-block-item">
            <div class="info-icon-badge">&#128087;</div>
            <div class="info-content">
              <span class="info-meta-label">Attire</span>
              <h3 class="info-main-title">Royal &amp; Formal Elegance</h3>
              <p class="info-desc-text">We invite our guests to grace our celebration in festive royal attire.</p>
              <div class="dresscode-chips-wrap">
                <span class="dress-chip">Traditional Kandyan / Indian Saree</span>
                <span class="dress-chip">National Dress</span>
                <span class="dress-chip">Evening Gown</span>
                <span class="dress-chip">Suit &amp; Tie</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Actions & RSVP -->
        <div class="card-actions-footer">
          <h3 class="rsvp-header-call">Honour Us With Your Presence</h3>
          <p class="rsvp-sub-call">Kindly confirm your attendance by December 31, 2026</p>

          <div class="action-buttons-group">
            
            <!-- WhatsApp RSVP with dynamic personalized message -->
            <a href="#" class="btn-rsvp-gold" id="btnWhatsappRsvp" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Confirm RSVP on WhatsApp</span>
            </a>

            <!-- Add to Calendar (.ics download generator) -->
            <button class="btn-action-outline" id="btnAddToCalendar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Add Event to Calendar</span>
            </button>

            <!-- Share Invitation Link Button -->
            <button class="btn-action-outline" id="btnShareInvite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span id="shareBtnText">Share Royal Invitation</span>
            </button>

          </div>

          <!-- Quick Blessings & Wishes Book -->
          <div class="wishes-quick-box">
            <p class="wishes-title">&#10022; Send Your Royal Blessings &#10022;</p>
            <textarea 
              class="wishes-input" 
              id="wishesMessageInput" 
              placeholder="Write warm wishes &amp; blessings to Kaveesha &amp; Shanshana..."
            ></textarea>
            <button class="send-wish-btn" id="btnSendWish">Send Wishes with Confetti &#10024;</button>
          </div>

          <!-- Replay Button -->
          <span class="replay-experience-link" id="btnReplayExperience">
            &#8634; Replay Royal Envelope &amp; Portrait Experience
          </span>

          <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:0.85rem;color:rgba(250,230,158,0.4);margin-top:20px;letter-spacing:0.05em;">
            Watersage Hotel &bull; January 15, 2027 &bull; Kaveesha &amp; Shanshana
          </p>

        </div>

      </div>
    </section>

  </main>

  <script>
    'use strict';

    /* =========================================================
       STATE & INITIALIZATION
       ========================================================= */
    let currentGuestName = "Our Esteemed Guest";
    let isEnvelopeOpened = false;
    let isNamesRevealed = false;

    // Check URL parameters for ?guest=...
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('guest') || urlParams.get('name');
    if (guestParam && guestParam.trim()) {
      currentGuestName = guestParam.trim();
      document.getElementById('envelopeGuestInput').value = currentGuestName;
    }

    /* =========================================================
       CANVAS AMBIENT GOLD DUST & SILK PETALS
       ========================================================= */
    const canvas = document.getElementById('ambient-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let petals = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle constructor
    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? '#f9e8a2' : '#d4af37'
      };
    }

    // Petal constructor
    function createPetal() {
      return {
        x: Math.random() * canvas.width,
        y: -20,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.45 + 0.25,
        color: Math.random() > 0.5 ? 'rgba(180, 25, 45, 0.45)' : 'rgba(215, 60, 80, 0.35)'
      };
    }

    for (let i = 0; i < 45; i++) {
      particles.push(createParticle());
    }
    for (let i = 0; i < 15; i++) {
      petals.push(createPetal());
    }

    function animateAmbient() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gold particles
      for (let p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
      }

      // Falling silk petals
      for (let pt of petals) {
        pt.y += pt.speedY;
        pt.x += pt.speedX;
        pt.rotation += pt.rotSpeed;
        if (pt.y > canvas.height + 20) {
          pt.y = -20;
          pt.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate((pt.rotation * Math.PI) / 180);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.opacity;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.ellipse(0, 0, pt.size, pt.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animateAmbient);
    }
    animateAmbient();

    /* =========================================================
       AUDIO SYNTHESIZER (WEB AUDIO API ROYAL HARP CHIMES)
       ========================================================= */
    let audioCtx = null;
    let isMusicPlaying = false;
    let musicTimer = null;
    const musicBtn = document.getElementById('musicToggleBtn');

    // Royal harp chord progressions (pentatonic celestial wedding intervals)
    const melodyFrequencies = [
      261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99
    ];

    function initAudio() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playHarpNote(freq, delay = 0) {
      if (!audioCtx || !isMusicPlaying) return;
      setTimeout(() => {
        if (!isMusicPlaying) return;
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.4);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 2.5);
        } catch(e) {}
      }, delay);
    }

    function playArpeggio() {
      if (!isMusicPlaying) return;
      const chords = [
        [melodyFrequencies[0], melodyFrequencies[2], melodyFrequencies[4], melodyFrequencies[5]],
        [melodyFrequencies[1], melodyFrequencies[3], melodyFrequencies[5], melodyFrequencies[7]],
        [melodyFrequencies[2], melodyFrequencies[4], melodyFrequencies[6], melodyFrequencies[8]],
        [melodyFrequencies[0], melodyFrequencies[3], melodyFrequencies[4], melodyFrequencies[7]]
      ];
      const selectedChord = chords[Math.floor(Math.random() * chords.length)];
      selectedChord.forEach((freq, idx) => {
        playHarpNote(freq, idx * 360);
      });
    }

    function toggleMusic() {
      initAudio();
      isMusicPlaying = !isMusicPlaying;
      if (isMusicPlaying) {
        musicBtn.classList.add('playing');
        playArpeggio();
        musicTimer = setInterval(playArpeggio, 3200);
      } else {
        musicBtn.classList.remove('playing');
        if (musicTimer) clearInterval(musicTimer);
      }
    }
    musicBtn.addEventListener('click', toggleMusic);

    /* =========================================================
       SPARKLES & CONFETTI GENERATORS
       ========================================================= */
    function triggerCelebrationParticles(originX, originY, count = 35) {
      const container = document.createElement('div');
      container.className = 'celebration-burst';
      container.style.left = originX + 'px';
      container.style.top = originY + 'px';
      document.body.appendChild(container);

      const colors = ['#f9e8a2', '#d4af37', '#b31625', '#fff', '#e8b4b8', '#ffdf80'];

      for (let i = 0; i < count; i++) {
        const chip = document.createElement('div');
        chip.className = 'confetti-chip';
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 160 + 40;
        const dx = Math.cos(angle) * dist + 'px';
        const dy = Math.sin(angle) * dist + 'px';
        const rot = (Math.random() * 720 - 360) + 'deg';
        const sz = (Math.random() * 8 + 5) + 'px';
        const col = colors[Math.floor(Math.random() * colors.length)];

        chip.style.setProperty('--dx', dx);
        chip.style.setProperty('--dy', dy);
        chip.style.setProperty('--rot', rot);
        chip.style.width = sz;
        chip.style.height = (Math.random() > 0.5 ? sz : (parseInt(sz) * 1.8) + 'px');
        chip.style.background = col;
        chip.style.boxShadow = '0 0 8px ' + col;

        container.appendChild(chip);
      }

      setTimeout(() => container.remove(), 2200);
    }

    /* Screen transition helper */
    function switchScenes(fromId, toId, callback) {
      const flash = document.getElementById('flashOverlay');
      flash.classList.add('active');

      setTimeout(() => {
        document.getElementById(fromId).classList.add('hidden-view');
        document.getElementById(toId).classList.remove('hidden-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          flash.classList.remove('active');
          if (callback) callback();
        }, 150);
      }, 500);
    }

    /* Guest name preset helper */
    window.setGuestName = function(name) {
      const input = document.getElementById('envelopeGuestInput');
      input.value = name;
      currentGuestName = name;
      input.focus();
    };

    /* =========================================================
       STAGE 1: OPEN ENVELOPE EVENT
       ========================================================= */
    const waxSealBtn = document.getElementById('waxSealBtn');
    const envelopeWrap = document.getElementById('envelopeInteractiveWrap');
    const guestInput = document.getElementById('envelopeGuestInput');

    function executeEnvelopeOpen(e) {
      if (isEnvelopeOpened) return;
      isEnvelopeOpened = true;

      // Capture entered guest name
      const entered = guestInput.value.trim();
      if (entered) {
        currentGuestName = entered;
      }
      document.getElementById('displayGuestName').textContent = currentGuestName;
      updateWhatsappLink();

      // Sound activation
      initAudio();
      if (!isMusicPlaying) {
        toggleMusic();
      }

      // Sparkle burst on wax seal
      const rect = waxSealBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      triggerCelebrationParticles(cx, cy, 40);

      // Trigger 3D envelope fold open
      envelopeWrap.classList.add('opened');

      // Transition to Stage 2 (Couple Portrait)
      setTimeout(() => {
        switchScenes('stageEnvelope', 'stagePortrait', () => {
          // Trigger welcoming sparkle in the portrait
          const pRect = document.getElementById('couplePortraitFrame').getBoundingClientRect();
          triggerCelebrationParticles(pRect.left + pRect.width / 2, pRect.top + 100, 25);
        });
      }, 1600);
    }

    waxSealBtn.addEventListener('click', executeEnvelopeOpen);
    envelopeWrap.addEventListener('click', (e) => {
      if (e.target !== guestInput) {
        executeEnvelopeOpen(e);
      }
    });

    /* =========================================================
       STAGE 2 & 3: TOUCH PHOTO TO REVEAL NAMES
       ========================================================= */
    const portraitFrame = document.getElementById('couplePortraitFrame');
    const touchPromptWrapper = document.getElementById('touchPromptWrapper');
    const namesRevealOverlay = document.getElementById('namesRevealOverlay');
    const proceedDetailsBtn = document.getElementById('proceedDetailsBtn');

    function revealCoupleNames(e) {
      if (isNamesRevealed) return;
      isNamesRevealed = true;

      // Sparkles at touch point
      const x = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
      const y = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
      triggerCelebrationParticles(x, y, 45);

      // Play celestial chime
      if (audioCtx) {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          playHarpNote(freq, i * 180);
        });
      }

      // Hide touch cue and reveal calligraphy names
      touchPromptWrapper.classList.add('faded-out');
      namesRevealOverlay.classList.add('active-revealed');
    }

    portraitFrame.addEventListener('click', (e) => {
      if (!isNamesRevealed) {
        revealCoupleNames(e);
      }
    });
    portraitFrame.addEventListener('touchstart', (e) => {
      if (!isNamesRevealed) {
        revealCoupleNames(e);
      }
    }, { passive: true });

    /* =========================================================
       STAGE 3 -> STAGE 4: PROCEED TO FULL INVITATION DETAILS
       ========================================================= */
    proceedDetailsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = proceedDetailsBtn.getBoundingClientRect();
      triggerCelebrationParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);

      switchScenes('stagePortrait', 'stageDetails', () => {
        startWeddingCountdown();
      });
    });

    /* =========================================================
       STAGE 4: COUNTDOWN TIMER TO JANUARY 15, 2027
       ========================================================= */
    let countdownInterval = null;
    function startWeddingCountdown() {
      if (countdownInterval) clearInterval(countdownInterval);

      const targetWeddingDate = new Date('2027-01-15T10:00:00+05:30').getTime();

      function updateClock() {
        const now = new Date().getTime();
        const diff = targetWeddingDate - now;

        if (diff <= 0) {
          document.getElementById('cdDays').textContent = '00';
          document.getElementById('cdHours').textContent = '00';
          document.getElementById('cdMins').textContent = '00';
          document.getElementById('cdSecs').textContent = '00';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
        document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
        document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
      }

      updateClock();
      countdownInterval = setInterval(updateClock, 1000);
    }

    /* =========================================================
       DYNAMIC WHATSAPP RSVP & CALENDAR GENERATOR
       ========================================================= */
    function updateWhatsappLink() {
      const msg = encodeURIComponent(
        \`Royal Wedding RSVP for Kaveesha & Shanshana\\n\\n\` +
        \`Dear Kaveesha & Shanshana,\\n\` +
        \`I, \${currentGuestName}, am delighted to confirm our presence for your royal wedding at Watersage Hotel on January 15, 2027!\\n\\n\` +
        \`Wishing you both a lifetime of eternal love & bliss!\`
      );
      document.getElementById('btnWhatsappRsvp').href = \`https://wa.me/?text=\${msg}\`;
    }

    // Add to Calendar .ics generator
    document.getElementById('btnAddToCalendar').addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Royal Wedding//Kaveesha and Shanshana//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'SUMMARY:Royal Wedding Celebration: Kaveesha & Shanshana',
        'DESCRIPTION:The wedding ceremony and royal reception of Kaveesha & Shanshana at Watersage Hotel.',
        'LOCATION:Watersage Hotel, Sri Lanka',
        'DTSTART:20270115T043000Z',
        'DTEND:20270115T180000Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\\r\\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Kaveesha_Shanshana_Royal_Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerCelebrationParticles(window.innerWidth / 2, window.innerHeight / 2, 25);
    });

    // Share link button
    const shareBtn = document.getElementById('btnShareInvite');
    const shareBtnText = document.getElementById('shareBtnText');
    shareBtn.addEventListener('click', () => {
      const shareUrl = window.location.origin + window.location.pathname + '?guest=' + encodeURIComponent(currentGuestName);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          shareBtnText.textContent = 'Link Copied to Clipboard!';
          triggerCelebrationParticles(window.innerWidth / 2, window.innerHeight / 2, 30);
          setTimeout(() => {
            shareBtnText.textContent = 'Share Royal Invitation';
          }, 3000);
        });
      } else {
        alert('Invitation link: ' + shareUrl);
      }
    });

    // Send wishes button
    const sendWishBtn = document.getElementById('btnSendWish');
    const wishesInput = document.getElementById('wishesMessageInput');
    sendWishBtn.addEventListener('click', () => {
      const text = wishesInput.value.trim();
      if (!text) {
        wishesInput.placeholder = 'Please write a heartfelt wish first...';
        wishesInput.focus();
        return;
      }
      sendWishBtn.textContent = 'Blessings Sent! \\u2728';
      wishesInput.value = '';
      triggerCelebrationParticles(window.innerWidth / 2, window.innerHeight / 2, 60);
      setTimeout(() => {
        sendWishBtn.textContent = 'Send Wishes with Confetti \\u2728';
      }, 3500);
    });

    // Replay Experience
    document.getElementById('btnReplayExperience').addEventListener('click', () => {
      isEnvelopeOpened = false;
      isNamesRevealed = false;
      envelopeWrap.classList.remove('opened');
      touchPromptWrapper.classList.remove('faded-out');
      namesRevealOverlay.classList.remove('active-revealed');
      switchScenes('stageDetails', 'stageEnvelope');
    });

  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
console.log('index.html built successfully with size:', fs.statSync(path.join(__dirname, 'index.html')).size);
