document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultSection = document.getElementById('result-section');
    const sentimentText = document.getElementById('sentiment-text');
    const confidenceText = document.getElementById('confidence-text');
    const highlightedText = document.getElementById('highlighted-text');
    const sentimentFill = document.getElementById('sentiment-fill');

    analyzeBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter some text to analyze.');
            return;
        }

        // Perform sentiment analysis
        const result = analyzeSentiment(text);
        
        // Display results
        displayResults(result, text);
        
        // Show result section
        resultSection.classList.remove('hidden');
    });

    function analyzeSentiment(text) {
        // Using compromise.js for basic sentiment analysis
        const nlp = window.nlp(text);
        const terms = nlp.terms().out('terms');
        
        let positiveScore = 0;
        let negativeScore = 0;
        let neutralScore = 0;
        
        // Simple sentiment analysis scoring
        terms.forEach(term => {
            const word = term.text.toLowerCase();
            if (positiveWords.includes(word)) {
                positiveScore += 1 + (term.tags.indexOf('Strong') !== -1 ? 0.5 : 0);
            } else if (negativeWords.includes(word)) {
                negativeScore += 1 + (term.tags.indexOf('Strong') !== -1 ? 0.5 : 0);
            } else {
                neutralScore += 1;
            }
        });
        
        const total = positiveScore + negativeScore + neutralScore;
        const normalizedPos = positiveScore / total;
        const normalizedNeg = negativeScore / total;
        
        // Determine sentiment
        let sentiment;
        let confidence;
        let score;
        
        if (normalizedPos > normalizedNeg && (normalizedPos - normalizedNeg) > 0.1) {
            sentiment = 'Positive';
            confidence = normalizedPos;
            score = (normalizedPos * 50) + 50; // Map to 50-100 range
        } else if (normalizedNeg > normalizedPos && (normalizedNeg - normalizedPos) > 0.1) {
            sentiment = 'Negative';
            confidence = normalizedNeg;
            score = normalizedNeg * 50; // Map to 0-50 range
        } else {
            sentiment = 'Neutral';
            confidence = 1 - Math.abs(normalizedPos - normalizedNeg);
            score = 50; // Middle position
        }
        
        return {
            sentiment,
            confidence: confidence.toFixed(2),
            score,
            positiveWords: terms.filter(term => positiveWords.includes(term.text.toLowerCase())).map(term => term.text),
            negativeWords: terms.filter(term => negativeWords.includes(term.text.toLowerCase())).map(term => term.text)
        };
    }
    
    function displayResults(result, originalText) {
        // Set sentiment text and class
        sentimentText.textContent = result.sentiment;
        sentimentText.className = result.sentiment.toLowerCase();
        
        // Set confidence
        confidenceText.textContent = ${(result.confidence * 100).toFixed(0)}%;
        
        // Position the sentiment indicator
        sentimentFill.style.left = ${result.score}%;
        
        // Highlight positive and negative words
        let highlightedHTML = originalText;
        
        result.positiveWords.forEach(word => {
            const regex = new RegExp(\\b${word}\\b, 'gi');
            highlightedHTML = highlightedHTML.replace(regex, <span class="positive">${word}</span>);
        });
        
        result.negativeWords.forEach(word => {
            const regex = new RegExp(\\b${word}\\b, 'gi');
            highlightedHTML = highlightedHTML.replace(regex, <span class="negative">${word}</span>);
        });
        
        highlightedText.innerHTML = highlightedHTML;
    }
    
    // Simple sentiment word lists (would normally be more comprehensive)
    const positiveWords = [
        'happy', 'joy', 'love', 'great', 'excellent', 'amazing', 'wonderful',
        'fantastic', 'superb', 'awesome', 'good', 'pleased', 'delighted',
        'perfect', 'nice', 'positive', 'best', 'fortunate', 'success', 'win'
    ];
    
    const negativeWords = [
        'sad', 'angry', 'hate', 'bad', 'terrible', 'awful', 'horrible',
        'worst', 'unhappy', 'poor', 'negative', 'disappointed', 'failure',
        'lose', 'lost', 'upset', 'pain', 'fear', 'worry', 'doubt'
    ];
});