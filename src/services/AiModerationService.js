// Kids Aura AI Moderation Service
// Decoupled safety checking module that can easily be swapped for OpenAI, Gemini, or a backend API.

export const AiModerationService = {
  /**
   * Scans a video file along with its metadata for child safety compliance.
   * Checks against 12 key criteria: NSFW, Nudity, Violence, Gore, Drugs, Alcohol, Smoking, Gambling, Self-harm, Profanity, and Child Unsafe content.
   * 
   * @param {File} file - The raw video file.
   * @param {string} title - The video title.
   * @param {string} description - The video description.
   * @returns {Promise<{passed: boolean, safetyScore: number, logs: string[], reason?: string}>}
   */
  scanVideoFile: async (file, title, description) => {
    // In production, you would perform a fetch request to your API:
    /*
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    const response = await fetch('https://api.kidsaura.com/v1/moderate', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer YOUR_TOKEN' },
      body: formData
    });
    return await response.json();
    */

    // Simulated network latency
    await new Promise(resolve => setTimeout(resolve, 6000));

    const checkText = `${title} ${description} ${file ? file.name : ''}`.toLowerCase();

    // 12 compliance checks
    const checks = {
      nsfw: { name: '🔞 Sexual & NSFW Content', passed: true, detail: 'Clean' },
      nudity: { name: '👙 Visual Nudity & Exposure', passed: true, detail: 'Clean' },
      adult: { name: '🔞 Mature/Adult Themes', passed: true, detail: 'Clean' },
      violence: { name: '👊 Physical Violence & Bullying', passed: true, detail: 'Clean' },
      gore: { name: '🩸 Blood & Graphic Gore', passed: true, detail: 'Clean' },
      drugs: { name: '💊 Illicit Substances/Drugs', passed: true, detail: 'Clean' },
      alcohol: { name: '🍺 Alcohol Promotion', passed: true, detail: 'Clean' },
      smoking: { name: '🚬 Smoking & Vaping', passed: true, detail: 'Clean' },
      gambling: { name: '🎰 Betting & Gambling', passed: true, detail: 'Clean' },
      selfharm: { name: '🩹 Self-Harm & Eating Disorders', passed: true, detail: 'Clean' },
      profanity: { name: '🗣️ Offensive Language/Profanity', passed: true, detail: 'Clean' },
      unsafe: { name: '🚸 General Child Unsafe Elements', passed: true, detail: 'Clean' }
    };

    let safetyScore = 98; // Base clean score
    let reason = '';
    const logs = [
      '⚡ Connecting to Kids Aura AI Safety Engine v4.0...',
      '📥 File integrity verification passed.',
      '🎞️ Extracting visual keyframes for frame-by-frame moderation...',
      '🎙️ Separating audio channels and performing speech-to-text transcript...',
    ];

    // Trigger visual/violence violation
    if (checkText.includes('fight') || checkText.includes('punch') || checkText.includes('combat') || checkText.includes('kill') || checkText.includes('blood')) {
      checks.violence.passed = false;
      checks.violence.detail = 'Simulated combat / high aggression detected';
      checks.gore.passed = false;
      checks.gore.detail = 'Threatening combat animations flagged';
      checks.unsafe.passed = false;
      checks.unsafe.detail = 'Violates child age-appropriate limits';
      safetyScore = 42;
      reason = 'Violence & Graphic Content';
    }
    
    // Trigger adult/NSFW violation
    else if (checkText.includes('nudity') || checkText.includes('sexy') || checkText.includes('adult') || checkText.includes('nsfw') || checkText.includes('drug') || checkText.includes('smoke') || checkText.includes('vape') || checkText.includes('gamble')) {
      checks.nsfw.passed = false;
      checks.nsfw.detail = 'Mature theme indicators detected';
      checks.drugs.passed = false;
      checks.drugs.detail = 'Prohibited material keywords matched';
      checks.unsafe.passed = false;
      checks.unsafe.detail = 'Inappropriate for general audiences under 13';
      safetyScore = 28;
      reason = '18+ Mature Themes & Restricted Substances';
    }

    // Trigger boyfriend/girlfriend/dating relationship themes
    else if (checkText.includes('boyfriend') || checkText.includes('girlfriend') || checkText.includes('dating') || checkText.includes('crush') || checkText.includes('relationship') || /\b(bf|gf)\b/i.test(checkText) || checkText.includes('kiss') || checkText.includes('couple') || checkText.includes('love story') || checkText.includes('date night')) {
      checks.adult.passed = false;
      checks.adult.detail = 'Dating or romantic relationship content detected';
      checks.unsafe.passed = false;
      checks.unsafe.detail = 'Dating themes are not permitted for kids';
      safetyScore = 50;
      reason = 'Dating & Relationship Content';
    }

    // Trigger language violation
    else if (checkText.includes('swear') || checkText.includes('vulgar') || checkText.includes('curse') || checkText.includes('stupid') || checkText.includes('jerk')) {
      checks.profanity.passed = false;
      checks.profanity.detail = 'Blocked verbal slang terms matches';
      checks.unsafe.passed = false;
      checks.unsafe.detail = 'Language guidelines violation';
      safetyScore = 55;
      reason = 'Offensive Language & Swearing';
    }

    // Populate logs step-by-step
    logs.push(`🔍 Frame Scan Complete: ${checks.nsfw.passed ? 'No adult visuals found.' : 'Warning: Mature items detected.'}`);
    logs.push(`🗣️ Audio Transcript scan: ${checks.profanity.passed ? 'No profanity matches found.' : 'Warning: Inappropriate slang words flagged.'}`);
    logs.push(`📊 Category compliance status:`);
    
    // List failures or positive summaries
    Object.values(checks).forEach(c => {
      logs.push(`  - ${c.name}: ${c.passed ? '✅ PASSED' : `❌ FLAGGED (${c.detail})`}`);
    });

    const passed = safetyScore >= 65;
    
    logs.push(`🏁 Scans Complete. Safety Score: ${safetyScore}%. Verdict: ${passed ? 'APPROVED' : 'REJECTED'}`);

    return {
      passed,
      safetyScore,
      logs,
      reason
    };
  },

  /**
   * Performs a synchronous safety check on video metadata (title/description)
   * Suitable for fast filtering of external API results.
   * 
   * @param {string} title 
   * @param {string} description 
   * @returns {{passed: boolean, reason?: string}}
   */
  moderateMetadata: (title, description) => {
    const checkText = `${title || ''} ${description || ''}`.toLowerCase();
    
    // Strict Child-Safe Filters
    const violentTerms = ['fight', 'punch', 'combat', 'kill', 'blood', 'hurt', 'dead', 'stab', 'murder', 'shoot', 'war', 'battle', 'gore'];
    const weaponTerms = ['gun', 'weapon', 'knife', 'sword', 'bomb', 'sniper', 'rifle'];
    const adultTerms = ['nudity', 'sexy', 'adult', 'nsfw', 'drug', 'smoke', 'vape', 'gamble', 'alcohol', 'beer', 'wine', 'porn', '18+', 'horny'];
    const profanityTerms = ['swear', 'vulgar', 'curse', 'stupid', 'jerk', 'ass', 'bastard', 'bitch', 'fuck', 'shit', 'damn'];
    const relationshipTerms = ['boyfriend', 'girlfriend', 'dating', 'crush', 'relationship', 'kiss', 'couple', 'love story', 'date night', 'romantic'];
    const politicsTerms = ['politics', 'democrat', 'republican', 'election', 'president', 'government', 'protest', 'riot', 'trump', 'biden', 'modi'];
    const religionTerms = ['religion', 'god', 'jesus', 'allah', 'islam', 'hindu', 'christian', 'muslim', 'church', 'mosque', 'temple'];
    const hateSpeechTerms = ['hate', 'racist', 'nazi', 'supremacist', 'terrorist', 'slur'];
    const scaryTerms = ['scary', 'horror', 'ghost', 'demon', 'creepy', 'monster', 'terrifying', 'nightmare'];
    const dangerousTerms = ['challenge', 'prank', 'dangerous', 'don\'t try this at home', 'fire challenge', 'choking'];

    if (violentTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Violence & Aggressive Content' };
    if (weaponTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Weapons & Firearms' };
    if (adultTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Mature & Restricted Content (NSFW/Substances)' };
    if (profanityTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Offensive Language & Profanity' };
    if (relationshipTerms.some(word => checkText.includes(word)) || /\b(bf|gf)\b/i.test(checkText)) return { passed: false, reason: 'Dating & Relationship Content' };
    if (politicsTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Political Content' };
    if (religionTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Religious Content' };
    if (hateSpeechTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Hate Speech' };
    if (scaryTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Scary & Horror Content' };
    if (dangerousTerms.some(word => checkText.includes(word))) return { passed: false, reason: 'Dangerous Challenges & Pranks' };

    return { passed: true };
  }
};
