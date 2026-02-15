// ================= CONFIG =================
const API_URL = 'http://localhost:8000';

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
});

// ================= SMOOTH NAVIGATION =================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// ================= CHARACTER COUNTER =================
const contentInput = document.getElementById('content-input');

if (contentInput) {
    contentInput.addEventListener('input', updateCharCount);
}

function updateCharCount() {
    const text = contentInput.value;
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    document.getElementById('char-count').textContent = charCount;
    document.getElementById('word-count').textContent = wordCount;
}

// ================= SCROLL HELPERS =================
function scrollToAnalyze() {
    document.getElementById('analyze').scrollIntoView({ behavior: 'smooth' });
}

function scrollToEducation() {
    document.getElementById('education').scrollIntoView({ behavior: 'smooth' });
}

// ================= MAIN ANALYSIS =================
async function analyzeContent() {
    const content = contentInput.value.trim();
    if (!content || content.length < 10) {
        showToast("Please enter at least 10 characters to analyze.");
        return;
    }

    const analyzeBtn = document.querySelector('.btn-analyze');
    const btnText = document.getElementById('analyze-btn-text');
    const loader = document.getElementById('analyze-loader');

    // UI Loading State
    analyzeBtn.disabled = true;
    btnText.textContent = "Analyzing credibility...";
    loader.style.display = 'inline-block';

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (!response.ok) throw new Error("Server error");

        const result = await response.json();
        displayResults(result);

    } catch (error) {
        console.error("Analysis Error:", error);
        showToast("Unable to connect to backend. Please check if Python server is running.");
    } finally {
        analyzeBtn.disabled = false;
        btnText.textContent = "Analyze Content";
        loader.style.display = 'none';
    }
}

// ================= DISPLAY RESULTS =================
function displayResults(result) {
    const resultsSection = document.getElementById('results-section');
    const categoryBadge = document.getElementById('category-badge');
    
    // 1. Show Section with Animation (Fade In)
    resultsSection.style.display = 'block';
    resultsSection.classList.remove('fade-in-up');
    void resultsSection.offsetWidth; 
    resultsSection.classList.add('fade-in-up');

    // 2. Update Badge & Colors
    categoryBadge.textContent = result.category.toUpperCase();
    categoryBadge.className = `category-badge ${result.category.toLowerCase()}`;

    // 3. Update Text Content
    document.getElementById('category-explanation').textContent = result.explanation;
    document.getElementById('recommendation').textContent = result.recommendation;

    // 4. Update Key Findings
    const keyFindings = document.getElementById('key-findings');
    keyFindings.innerHTML = result.key_findings.map(item => `<li>${item}</li>`).join('');

    // 5. Update Red Flags
    const redFlags = document.getElementById('red-flags');
    if (result.red_flags && result.red_flags.length > 0 && result.red_flags[0].toLowerCase() !== "none detected") {
        redFlags.innerHTML = result.red_flags.map(flag => `<li>${flag}</li>`).join('');
    } else {
        redFlags.innerHTML = '<li>✅ Safe content. No red flags detected.</li>';
    }

    // 6. Refresh Icons
    lucide.createIcons();

    // 7. TRUTH SCORE LOGIC (New Implementation)
    // Backend se ab 'truth_score' aayega (0-100), 'confidence' nahi.
    const score = result.truth_score !== undefined ? result.truth_score : 0;
    const confidenceFill = document.getElementById('confidence-fill');
    const confidenceText = document.getElementById('confidence-text');

    // Determine Color based on Authenticity
    let barColor = '#ef4444'; // Red (Low/Misleading)
    if (score >= 80) {
        barColor = '#10b981'; // Green (Safe)
    } else if (score >= 40) {
        barColor = '#f59e0b'; // Yellow (Caution)
    }

    setTimeout(() => {
        confidenceFill.style.backgroundColor = barColor; // Apply dynamic color
        confidenceFill.style.width = `${score}%`;
        animateCounter(confidenceText, score);
    }, 100);

    // 8. Smooth Scroll to Results
    const headerOffset = 100;
    const elementPosition = resultsSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

// ================= COUNTER ANIMATION =================
function animateCounter(element, target) {
    let current = 0;
    // Speed calculation so animation always takes similar time
    const increment = target > 0 ? Math.ceil(target / 50) : 1; 

    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        // Updated Text Label
        element.textContent = `${current}% Authenticity Score`;
    }, 20);
}

// ================= CLEAR =================
function clearAnalysis() {
    contentInput.value = '';
    updateCharCount();
    document.getElementById('results-section').style.display = 'none';
}

// ================= UTILS & MODALS =================
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        background: '#0f172a', color: 'white', padding: '12px 24px', borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: '9999', fontSize: '14px',
        fontWeight: '500'
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ================= EDUCATIONAL CONTENT =================
// (Apka purana content waisa ka waisa hi hai)
const resourceContent = {
    'fake-productivity': {
        title: 'What is Fake Productivity?',
        content: `
            <h2>Understanding Fake Productivity</h2>
            <p><strong>Fake productivity</strong> is content that promotes unrealistic or harmful work habits disguised as legitimate success advice. It's become increasingly common in social media and online content.</p>
            
            <h3>Common Characteristics:</h3>
            <ul>
                <li><strong>Extreme Schedules:</strong> "Wake up at 4am and work 18 hours"</li>
                <li><strong>Toxic Hustle Culture:</strong> "Sleep is for the weak" mentality</li>
                <li><strong>Impossible Standards:</strong> Claims of learning complex skills in unrealistic timeframes</li>
                <li><strong>Survivorship Bias:</strong> "I did X and became successful, so you should too"</li>
                <li><strong>Lack of Context:</strong> Ignoring individual circumstances, resources, or challenges</li>
            </ul>
            
            <h3>Why It's Harmful:</h3>
            <ul>
                <li>Promotes burnout and mental health issues</li>
                <li>Sets unrealistic expectations for students</li>
                <li>Ignores work-life balance</li>
                <li>Can lead to feelings of inadequacy and failure</li>
                <li>Oversimplifies complex career paths</li>
            </ul>
            
            <h3>Real Example:</h3>
            <p class="example-box">"Wake up at 4am, cold shower, gym for 2 hours, learn 3 programming languages before breakfast, build 5 apps, read 10 books per week. That's how I became a millionaire at 21!"</p>
            <p><strong>Red Flags:</strong> Extreme schedule, unrealistic claims, survivorship bias, lack of nuance.</p>
        `
    },
    'red-flags': {
        title: 'Red Flags to Watch For',
        content: `
            <h2>Identifying Misleading Advice</h2>
            <p>Learn to spot the warning signs of fake productivity and misleading career advice.</p>
            
            <h3>🚨 Major Red Flags:</h3>
            
            <h4>1. Unrealistic Timelines</h4>
            <ul>
                <li>"Become a senior developer in 3 months"</li>
                <li>"Master data science in 2 weeks"</li>
                <li>"Build a startup and get funded in 30 days"</li>
            </ul>
            <p><strong>Reality:</strong> Expertise takes years, not weeks.</p>
            
            <h4>2. Survivor Bias</h4>
            <ul>
                <li>"I dropped out and became a billionaire, so should you"</li>
                <li>"This worked for me, it will work for everyone"</li>
                <li>Ignoring failures and alternative paths</li>
            </ul>
            <p><strong>Reality:</strong> Success stories often ignore luck, timing, and privilege.</p>
            
            <h4>3. Extreme Statements</h4>
            <ul>
                <li>"You MUST work 100 hours a week"</li>
                <li>"If you're not hustling 24/7, you're failing"</li>
                <li>"Sleep/rest is for losers"</li>
            </ul>
            <p><strong>Reality:</strong> Balance and sustainability are key to long-term success.</p>
            
            <h4>4. Lack of Nuance</h4>
            <ul>
                <li>One-size-fits-all solutions</li>
                <li>Ignoring individual circumstances</li>
                <li>No acknowledgment of challenges or trade-offs</li>
            </ul>
            <p><strong>Reality:</strong> Everyone's path is different.</p>
            
            <h4>5. Quick Success Promises</h4>
            <ul>
                <li>"Get rich quick with this one weird trick"</li>
                <li>"Guaranteed success in X days"</li>
                <li>"No effort required"</li>
            </ul>
            <p><strong>Reality:</strong> Sustainable success requires consistent effort over time.</p>
            
            <h3>✅ What to Look For Instead:</h3>
            <ul>
                <li>Realistic timelines with milestones</li>
                <li>Acknowledgment of challenges and failures</li>
                <li>Context about individual circumstances</li>
                <li>Evidence-based recommendations</li>
                <li>Emphasis on sustainable practices</li>
            </ul>
        `
    },
    'realistic-advice': {
        title: 'Realistic Career Advice',
        content: `
            <h2>What Good Advice Looks Like</h2>
            <p>Learn to recognize legitimate, helpful career guidance.</p>
            
            <h3>✅ Characteristics of Good Advice:</h3>
            
            <h4>1. Acknowledges Complexity</h4>
            <p>Good advice recognizes that career success is multifaceted and influenced by many factors including timing, resources, networking, and sometimes luck.</p>
            
            <h4>2. Provides Context</h4>
            <ul>
                <li>Explains the "why" behind recommendations</li>
                <li>Acknowledges different starting points</li>
                <li>Considers various circumstances and constraints</li>
            </ul>
            
            <h4>3. Realistic Timelines</h4>
            <p><strong>Example:</strong> "Learning web development to job-ready level typically takes 6-12 months of consistent study, depending on your background and time commitment."</p>
            
            <h4>4. Balanced Perspective</h4>
            <ul>
                <li>Discusses both pros and cons</li>
                <li>Mentions potential challenges</li>
                <li>Acknowledges trade-offs</li>
            </ul>
            
            <h4>5. Evidence-Based</h4>
            <ul>
                <li>Cites sources and research</li>
                <li>References industry standards</li>
                <li>Uses data to support claims</li>
            </ul>
            
            <h3>📚 Example of Good Advice:</h3>
            <p class="example-box">"Building a career in software engineering typically requires:</p>
            <ul>
                <li>1-2 years of focused learning (bootcamp or degree)</li>
                <li>Building a portfolio of projects</li>
                <li>Networking and job applications (can take 3-6 months)</li>
                <li>Continuous learning throughout your career</li>
                <li>Everyone's timeline varies based on background and circumstances</li>
                <li>It's okay to start part-time while working another job"</li>
            </ul>
            
            <h3>Key Principles:</h3>
            <ul>
                <li><strong>Honesty:</strong> Transparent about difficulties and requirements</li>
                <li><strong>Flexibility:</strong> Recognizes multiple valid paths</li>
                <li><strong>Sustainability:</strong> Promotes work-life balance</li>
                <li><strong>Inclusivity:</strong> Acknowledges different backgrounds and resources</li>
            </ul>
        `
    },
    'patterns': {
        title: 'Common Misleading Patterns',
        content: `
            <h2>Recognizing AI Slop and Low-Quality Content</h2>
            <p>With the rise of AI-generated content, it's important to identify patterns that indicate misleading or low-value advice.</p>
            
            <h3>🤖 AI-Generated "Slop" Patterns:</h3>
            
            <h4>1. Generic Templates</h4>
            <ul>
                <li>Lists that could apply to anything ("10 tips for success")</li>
                <li>Vague platitudes without specific examples</li>
                <li>Cookie-cutter structure repeated across topics</li>
            </ul>
            <p><strong>Example:</strong> "Be passionate, work hard, never give up, believe in yourself..."</p>
            
            <h4>2. Buzzword Overload</h4>
            <ul>
                <li>Excessive use of trendy terms without substance</li>
                <li>"Synergy," "disruptive," "game-changer" everywhere</li>
                <li>Technical jargon used incorrectly</li>
            </ul>
            
            <h4>3. Contradictory Information</h4>
            <ul>
                <li>Conflicting advice in the same article</li>
                <li>"Work 80 hours" then "maintain work-life balance"</li>
                <li>Inconsistent reasoning</li>
            </ul>
            
            <h4>4. Regurgitated Content</h4>
            <ul>
                <li>Same information across multiple sources</li>
                <li>No original insights or analysis</li>
                <li>Obvious copy-paste patterns</li>
            </ul>
            
            <h4>5. Lack of Specificity</h4>
            <ul>
                <li>No concrete examples or data</li>
                <li>Vague recommendations</li>
                <li>"Do better" without explaining how</li>
            </ul>
            
            <h3>📱 Social Media Red Flags:</h3>
            <ul>
                <li><strong>Engagement Bait:</strong> "Tag someone who needs this!"</li>
                <li><strong>False Urgency:</strong> "You're already behind! Start NOW!"</li>
                <li><strong>Toxic Comparison:</strong> "While you're sleeping, they're grinding"</li>
                <li><strong>Gatekeeping:</strong> "Real entrepreneurs don't..."</li>
            </ul>
            
            <h3>✅ Quality Content Indicators:</h3>
            <ul>
                <li>Specific, actionable advice</li>
                <li>Personal anecdotes with lessons learned</li>
                <li>Citations and sources</li>
                <li>Acknowledgment of limitations</li>
                <li>Original perspectives or analysis</li>
                <li>Consistent, logical arguments</li>
            </ul>
            
            <h3>🎯 Quick Check Questions:</h3>
            <ul>
                <li>Could this advice apply to literally anything?</li>
                <li>Does it provide specific, actionable steps?</li>
                <li>Is there evidence or examples?</li>
                <li>Does it acknowledge individual differences?</li>
                <li>Would a domain expert agree with this?</li>
            </ul>
        `
    },
    'healthy-habits': {
        title: 'Building Healthy Habits',
        content: `
            <h2>Evidence-Based Productivity & Career Development</h2>
            <p>Science-backed strategies for sustainable success without burnout.</p>
            
            <h3>🧠 The Science of Productivity:</h3>
            
            <h4>1. Work-Life Balance</h4>
            <p><strong>Research shows:</strong> Working more than 50 hours per week leads to diminishing returns and increased health risks.</p>
            <ul>
                <li>Schedule regular breaks (Pomodoro technique)</li>
                <li>Maintain boundaries between work and personal time</li>
                <li>Prioritize sleep (7-9 hours for optimal cognitive function)</li>
                <li>Exercise regularly (improves focus and mental health)</li>
            </ul>
            
            <h4>2. Incremental Progress</h4>
            <p><strong>The 1% Rule:</strong> Small, consistent improvements compound over time.</p>
            <ul>
                <li>Set realistic daily goals</li>
                <li>Track progress without obsessing</li>
                <li>Celebrate small wins</li>
                <li>Focus on consistency over intensity</li>
            </ul>
            
            <h4>3. Self-Compassion</h4>
            <p><strong>Research shows:</strong> Self-compassion leads to better outcomes than self-criticism.</p>
            <ul>
                <li>Treat yourself as you would a friend</li>
                <li>Learn from mistakes without harsh judgment</li>
                <li>Recognize that struggles are universal</li>
                <li>Practice mindfulness and self-awareness</li>
            </ul>
            
            <h4>4. Realistic Goal-Setting</h4>
            <p><strong>SMART Goals Framework:</strong></p>
            <ul>
                <li><strong>Specific:</strong> Clear and well-defined</li>
                <li><strong>Measurable:</strong> Track progress objectively</li>
                <li><strong>Achievable:</strong> Challenging but realistic</li>
                <li><strong>Relevant:</strong> Aligned with your values</li>
                <li><strong>Time-bound:</strong> Has a deadline</li>
            </ul>
            
            <h3>📅 Sample Sustainable Schedule:</h3>
            <div class="example-box">
                <p><strong>Morning (2-3 hours):</strong></p>
                <ul>
                    <li>Wake up at reasonable time (not 4am!)</li>
                    <li>Exercise or movement (30 min)</li>
                    <li>Focused work/study session</li>
                </ul>
                
                <p><strong>Afternoon (3-4 hours):</strong></p>
                <ul>
                    <li>Main productive work blocks</li>
                    <li>Lunch break (actual break!)</li>
                    <li>Collaboration or learning time</li>
                </ul>
                
                <p><strong>Evening:</strong></p>
                <ul>
                    <li>Review and plan for tomorrow (15 min)</li>
                    <li>Personal time and hobbies</li>
                    <li>Wind down routine</li>
                </ul>
            </div>
            
            <h3>💪 Building Sustainable Habits:</h3>
            <ul>
                <li><strong>Start Small:</strong> 5 minutes is better than nothing</li>
                <li><strong>Stack Habits:</strong> Attach new habits to existing ones</li>
                <li><strong>Environment Design:</strong> Make good choices easier</li>
                <li><strong>Track Simply:</strong> Use simple checkmarks, not complex systems</li>
                <li><strong>Be Flexible:</strong> Life happens; adapt and continue</li>
            </ul>
            
            <h3>⚖️ Warning Signs of Burnout:</h3>
            <ul>
                <li>Chronic fatigue despite rest</li>
                <li>Decreased performance</li>
                <li>Cynicism or detachment</li>
                <li>Physical symptoms (headaches, sleep issues)</li>
                <li>Loss of motivation</li>
            </ul>
            <p><strong>If experiencing these:</strong> Take a break, reassess priorities, seek support.</p>
        `
    },
    'critical-thinking': {
        title: 'Critical Thinking Guide',
        content: `
            <h2>Evaluating Advice Like a Pro</h2>
            <p>Develop the skills to critically assess any productivity or career advice you encounter.</p>
            
            <h3>🔍 The Critical Thinking Framework:</h3>
            
            <h4>1. Check the Source</h4>
            <ul>
                <li><strong>Who is the author?</strong> What are their credentials?</li>
                <li><strong>What's their experience?</strong> Is it relevant?</li>
                <li><strong>Do they have biases?</strong> (Selling a course? Promoting a product?)</li>
                <li><strong>Is the source reputable?</strong> Peer-reviewed? Industry-recognized?</li>
            </ul>
            
            <h4>2. Look for Evidence</h4>
            <ul>
                <li><strong>Is there research cited?</strong> Can you verify it?</li>
                <li><strong>Are claims backed by data?</strong> Or just anecdotes?</li>
                <li><strong>Sample size matters:</strong> "I did this" ≠ "This works for everyone"</li>
                <li><strong>Correlation ≠ Causation:</strong> Just because A and B happened together doesn't mean A caused B</li>
            </ul>
            
            <h4>3. Consider Context</h4>
            <ul>
                <li><strong>When was this written?</strong> Is it still relevant?</li>
                <li><strong>What's the full story?</strong> What's not being said?</li>
                <li><strong>Who is this for?</strong> Does it apply to your situation?</li>
                <li><strong>What resources did they have?</strong> Money? Connections? Time?</li>
            </ul>
            
            <h4>4. Question Extreme Claims</h4>
            <ul>
                <li><strong>"Always" and "Never" are red flags</strong></li>
                <li><strong>"Everyone" and "No one" ignore individual differences</strong></li>
                <li><strong>"Guaranteed" success is unrealistic</strong></li>
                <li><strong>"The only way" dismisses valid alternatives</strong></li>
            </ul>
            
            <h3>🎯 Questions to Ask:</h3>
            
            <div class="example-box">
                <h4>Before Following Any Advice:</h4>
                <ol>
                    <li>What evidence supports this claim?</li>
                    <li>Who benefits from me believing this?</li>
                    <li>What are the potential downsides?</li>
                    <li>Does this align with my values and goals?</li>
                    <li>What do experts in the field say?</li>
                    <li>Is this realistic for my situation?</li>
                    <li>What might I be sacrificing?</li>
                    <li>Can I test this in a small, safe way first?</li>
                </ol>
            </div>
            
            <h3>🚦 Traffic Light System:</h3>
            
            <h4>🟢 GREEN (Probably Safe):</h4>
            <ul>
                <li>Multiple reputable sources agree</li>
                <li>Evidence-based recommendations</li>
                <li>Acknowledges limitations and context</li>
                <li>Promotes sustainable practices</li>
            </ul>
            
            <h4>🟡 YELLOW (Proceed with Caution):</h4>
            <ul>
                <li>Some exaggeration but core idea seems valid</li>
                <li>Limited evidence but logical reasoning</li>
                <li>Anecdotal but from credible source</li>
                <li>May work for some but not all</li>
            </ul>
            
            <h4>🔴 RED (Avoid):</h4>
            <ul>
                <li>Contradicts expert consensus</li>
                <li>Promises unrealistic results</li>
                <li>Promotes harmful practices</li>
                <li>No evidence or reasoning</li>
                <li>Designed to sell something</li>
            </ul>
            
            <h3>📱 Social Media Specific Tips:</h3>
            <ul>
                <li><strong>Screenshot ≠ Truth:</strong> Easy to fake or take out of context</li>
                <li><strong>Engagement ≠ Quality:</strong> Viral doesn't mean accurate</li>
                <li><strong>Check Multiple Sources:</strong> Don't trust a single post</li>
                <li><strong>Look at Comments:</strong> Others might spot issues you missed</li>
                <li><strong>Verify Before Sharing:</strong> Don't spread misinformation</li>
            </ul>
            
            <h3>🎓 Practice Exercise:</h3>
            <p>Next time you see career/productivity advice, try this:</p>
            <ol>
                <li>Pause before reacting</li>
                <li>Identify 3 claims being made</li>
                <li>Ask: "What evidence supports this?"</li>
                <li>Consider: "What's the alternative view?"</li>
                <li>Decide: "Is this right for me?"</li>
            </ol>
        `
    }
};

// ================= MODAL LOGIC =================
function showResourceModal(resourceKey) {
    const modal = document.getElementById('resource-modal');
    const modalBody = document.getElementById('modal-body');
    const resource = resourceContent[resourceKey];
    
    if (resource) {
        modalBody.innerHTML = resource.content;
        modal.style.display = 'flex';
    }
}

function closeResourceModal() {
    document.getElementById('resource-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('resource-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// ================= FAQ TOGGLE =================
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const wasActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));

    if (!wasActive) {
        faqItem.classList.add('active');
    }
}

// ================= SCROLL SPY =================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop &&
            scrollPos < section.offsetTop + section.offsetHeight) {

            document.querySelectorAll('.nav-link')
                .forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
        }
    });
});

console.log("🚀 VerityAI Production JS Loaded");