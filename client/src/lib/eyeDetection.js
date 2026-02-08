import * as faceapi from 'face-api.js';

export const loadModels = async () => {
    const MODEL_URL = '/models';
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        console.log('Face-api models loaded');
    } catch (error) {
        console.error('Error loading face-api models:', error);
        throw error;
    }
};

export const detectEye = async (videoElement) => {
    if (!videoElement) return null;

    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 });

    // Detect single face with landmarks
    const detection = await faceapi.detectSingleFace(videoElement, options)
        .withFaceLandmarks();

    if (!detection) return null;

    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    // Calculate center and distance for alignment checking
    // Landmarks 36-41 are left eye, 42-47 are right eye

    return {
        leftEye,
        rightEye,
        detection: detection.detection,
        landmarks: landmarks.relativePositions
    };
};

/**
 * Checks if the eye is well-aligned within a target box
 * @param {Array} eyeLandmarks array of points
 * @param {Object} videoSize {width, height}
 * @param {Object} targetBox {x, y, width, height} (normalized 0-1 or absolute)
 */
export const isEyeAligned = (eyeLandmarks, videoSize, targetBox) => {
    if (!eyeLandmarks || eyeLandmarks.length === 0) return false;

    // Get eye center
    const xSum = eyeLandmarks.reduce((sum, p) => sum + p.x, 0);
    const ySum = eyeLandmarks.reduce((sum, p) => sum + p.y, 0);
    const centerX = xSum / eyeLandmarks.length;
    const centerY = ySum / eyeLandmarks.length;

    // Convert normalized target box to absolute if needed
    // targetBox: { x, y, width, height } where values are fractions of video size
    const tX = targetBox.x * videoSize.width;
    const tY = targetBox.y * videoSize.height;
    const tW = targetBox.width * videoSize.width;
    const tH = targetBox.height * videoSize.height;

    const isInside = (
        centerX >= tX &&
        centerX <= tX + tW &&
        centerY >= tY &&
        centerY <= tY + tH
    );

    return isInside;
};
