# Challenges & Learnings

## 1. The "Noise" Problem
*   **Challenge**: The internet is 90% spam, clickbait, and duplicate content. A naive clustering algorithm groups all "Click here to buy gold" spam into a massive false narrative.
*   **Solution**: We implemented strict **Preprocessing Pipelines** and used **Semantic Filtering** to discard low-quality sources before they even reach the embedding stage.

## 2. Cluster Stability
*   **Challenge**: In a streaming system, adding one new article can sometimes cause an entire cluster to shift or split, making the dashboard jittery.
*   **Learning**: We learned to use **Incremental Clustering** techniques (or batch windows) to ensure narrative IDs remain stable over time, so users can track the "same" story for days.

## 3. The "Black Box" of Embeddings
*   **Challenge**: Why did Article A group with Article B? High-dimensional vector space is counter-intuitive to humans.
*   **Solution**: We built the **Model Metrics** page and the visual **Narrative Map** (using PCA/t-SNE) to visually debug and trust the model's decisions. "Trust but Verify."

## 4. API Rate Limits
*   **Challenge**: Good financial news data is expensive or rate-limited.
*   **Learning**: We implemented efficient **Caching (Redis/Local)** and intelligent polling intervals. We only fetch updates when market volatility spikes, saving API credits during quiet hours.

## 5. Frontend Performance
*   **Challenge**: Rendering 2,000+ interactive dots on a web page can lag.
*   **Solution**: We optimized the React rendering cycle and considered switching to Canvas/WebGL (via Three.js or simple Canvas API) for the scatter plot to handle thousands of points at 60fps.
