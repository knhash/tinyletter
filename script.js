// ===== URL ENCODING/DECODING =====
function encodeLetterData(envelope, inside) {
    const data = JSON.stringify({ e: envelope, i: inside });
    // Use base64 encoding and make it URL-safe
    return btoa(unescape(encodeURIComponent(data)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function decodeLetterData(encoded) {
    try {
        // Reverse URL-safe base64
        let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding
        while (base64.length % 4) {
            base64 += '=';
        }
        const data = decodeURIComponent(escape(atob(base64)));
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to decode letter data:', e);
        return null;
    }
}

// ===== INITIALIZATION =====
const urlParams = new URLSearchParams(window.location.search);
const letterData = urlParams.get('l');

const createForm = document.getElementById('createForm');
const letterContainer = document.getElementById('letterContainer');

// ===== VIEW MODE =====
if (letterData) {
    const decoded = decodeLetterData(letterData);
    if (decoded) {
        createForm.classList.add('hidden');
        letterContainer.classList.add('show');
        
        document.getElementById('envelopeContent').textContent = decoded.e;
        document.getElementById('letterContent').textContent = decoded.i;
        
        initializeViewMode();
    } else {
        alert('Invalid letter link!');
    }
} else {
    // ===== CREATE MODE =====
    createForm.classList.remove('hidden');
    initializeCreateMode();
}

// ===== CREATE MODE LOGIC =====
function initializeCreateMode() {
    let creationStep = 'front'; // 'front', 'back', 'sending', 'sent'
    const createEnvelope = document.getElementById('createEnvelope');
    const flipBtn = document.getElementById('flipBtn');
    const sendBtn = document.getElementById('sendBtn');
    const envelopeTextarea = document.getElementById('createEnvelopeText');
    const insideTextarea = document.getElementById('createInsideText');
    const urlBoxWrapper = document.querySelector('.create-url-box-wrapper');
    const createHint = document.getElementById('createHint');
    
    // Initially disable send button
    sendBtn.disabled = true;
    
    flipBtn.addEventListener('click', function() {
        if (creationStep === 'front') {
            const envelopeText = envelopeTextarea.value.trim();
            if (!envelopeText) {
                envelopeTextarea.focus();
                return;
            }
            
            // Flip to back
            creationStep = 'back';
            createEnvelope.classList.add('flipped');
            sendBtn.disabled = false;
            createHint.textContent = '[ write your message ]';
            
            setTimeout(() => {
                insideTextarea.focus();
            }, 1000);
            
        } else if (creationStep === 'back') {
            // Flip back to front
            creationStep = 'front';
            createEnvelope.classList.remove('flipped');
            sendBtn.disabled = true;
            createHint.textContent = '[ write your letter ]';
            
            setTimeout(() => {
                envelopeTextarea.focus();
            }, 1000);
            
        } else if (creationStep === 'sent') {
            // Call back - reverse the animation
            creationStep = 'calling-back';
            flipBtn.disabled = true;
            sendBtn.disabled = true;
            flipBtn.textContent = '...';
            createHint.style.opacity = '0';
            
            // Hide URL box
            urlBoxWrapper.classList.remove('show');
            
            setTimeout(() => {
                // Slide envelope back in
                createEnvelope.classList.remove('sliding-out');
                
                setTimeout(() => {
                    // Unseal the envelope (top, left, right, bottom - reverse of sealing)
                    setTimeout(() => {
                        createEnvelope.classList.remove('seal-flap-1'); // top
                    }, 0);
                    
                    setTimeout(() => {
                        createEnvelope.classList.remove('seal-flap-2'); // left
                    }, 600);
                    
                    setTimeout(() => {
                        createEnvelope.classList.remove('seal-flap-3'); // right
                    }, 1200);
                    
                    setTimeout(() => {
                        createEnvelope.classList.remove('seal-flap-4'); // bottom
                        
                        setTimeout(() => {
                            // Ready to edit again
                            flipBtn.disabled = false;
                            sendBtn.disabled = false;
                            flipBtn.textContent = 'Flip';
                            creationStep = 'back';
                            createHint.textContent = '[ write your message ]';
                            createHint.style.opacity = '';
                            insideTextarea.focus();
                        }, 600);
                    }, 1800);
                }, 1200);
            }, 500);
        }
    });
    
    sendBtn.addEventListener('click', function() {
        if (creationStep === 'back') {
            const envelopeText = envelopeTextarea.value.trim();
            const insideText = insideTextarea.value.trim();
            
            if (!insideText) {
                insideTextarea.focus();
                return;
            }
            
            creationStep = 'sending';
            flipBtn.disabled = true;
            sendBtn.disabled = true;
            sendBtn.textContent = '...';
            createHint.style.opacity = '0';
            
            // Generate URL
            const encoded = encodeLetterData(envelopeText, insideText);
            const url = `${window.location.origin}${window.location.pathname}?l=${encoded}`;
            document.getElementById('createGeneratedUrl').value = url;
            
            // Seal flaps sequentially: bottom, right, left, top (reverse of opening)
            setTimeout(() => {
                createEnvelope.classList.add('seal-flap-4'); // bottom
            }, 0);
            
            setTimeout(() => {
                createEnvelope.classList.add('seal-flap-3'); // right
            }, 600);
            
            setTimeout(() => {
                createEnvelope.classList.add('seal-flap-2'); // left
            }, 1200);
            
            setTimeout(() => {
                createEnvelope.classList.add('seal-flap-1'); // top
            }, 1800);
            
            setTimeout(() => {
                // Slide envelope behind the wall (to the right)
                createEnvelope.classList.add('sliding-out');
                
                // Show URL box and enable callback
                setTimeout(() => {
                    urlBoxWrapper.classList.add('show');
                    flipBtn.disabled = false;
                    flipBtn.textContent = 'Call back';
                    sendBtn.textContent = 'Send';
                    createHint.textContent = '[ share your letter ]';
                    createHint.style.opacity = '';
                    creationStep = 'sent';
                }, 1000);
            }, 3000);
        }
    });
    
    // Copy button
    document.getElementById('createCopyBtn').addEventListener('click', function() {
        const urlInput = document.getElementById('createGeneratedUrl');
        urlInput.select();
        document.execCommand('copy');
        
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy';
        }, 2000);
    });
}

// ===== VIEW MODE LOGIC =====
function initializeViewMode() {
    let isOpen = false;
    let animating = false;

    const envelope = document.getElementById('envelope');
    const hint = document.getElementById('clickHint');
    
    envelope.addEventListener('click', function() {
        if (animating) return;
        
        if (!isOpen) {
            // Opening sequence
            animating = true;
            hint.style.opacity = '0';
            
            // Step 1: Flip 180 degrees
            envelope.classList.add('flipped');
            
            // Step 2: Open flaps sequentially (top, left, right, bottom)
            setTimeout(() => {
                envelope.classList.add('open-flap-1'); // top
            }, 1000);
            
            setTimeout(() => {
                envelope.classList.add('open-flap-2'); // left
            }, 1600);
            
            setTimeout(() => {
                envelope.classList.add('open-flap-3'); // right
            }, 2200);
            
            setTimeout(() => {
                envelope.classList.add('open-flap-4'); // bottom
            }, 2800);
            
            // Animation complete
            setTimeout(() => {
                hint.textContent = '[ click to close ]';
                hint.style.opacity = '1';
                animating = false;
                isOpen = true;
            }, 3400);
            
        } else {
            // Closing sequence (reverse)
            animating = true;
            hint.style.opacity = '0';
            
            // Step 1: Close flaps in reverse order (bottom, right, left, top)
            setTimeout(() => {
                envelope.classList.remove('open-flap-4'); // bottom
            }, 100);
            
            setTimeout(() => {
                envelope.classList.remove('open-flap-3'); // right
            }, 700);
            
            setTimeout(() => {
                envelope.classList.remove('open-flap-2'); // left
            }, 1300);
            
            setTimeout(() => {
                envelope.classList.remove('open-flap-1'); // top
            }, 1900);
            
            // Step 2: Flip back to front
            setTimeout(() => {
                envelope.classList.remove('flipped');
                hint.textContent = '[ click to open ]';
                hint.style.opacity = '1';
                animating = false;
                isOpen = false;
            }, 2500);
        }
    });
}
