from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

DISEASES = [
    {
        "name": "Cataract",
        "overview": "A cataract is a clouding of the clear lens of the eye. For people who have cataracts, seeing through cloudy lenses is a bit like looking through a frosty or fogged-up window.",
        "causes": [
            "Aging is the most common cause.",
            "Diabetes.",
            "Excessive exposure to sunlight.",
            "Smoking and alcohol use.",
            "Eye injury or inflammation."
        ],
        "symptoms": [
            "Clouded, blurred or dim vision.",
            "Increasing difficulty with vision at night.",
            "Sensitivity to light and glare.",
            "Need for brighter light for reading and other activities.",
            "Seeing 'halos' around lights."
        ],
        "precautions": [
            "Protect your eyes from UVB rays by wearing sunglasses.",
            "Quit smoking.",
            "Choose a healthy diet that includes plenty of fruits and vegetables.",
            "Limit alcohol intake."
        ],
        "doctor_advice": "Surgery is the only way to remove cataracts. If your vision isn't clear enough to do what you need to do, your doctor may suggest surgery.",
        "recommendation": "Consult an ophthalmologist for potential surgery."
    },
    {
        "name": "Glaucoma",
        "overview": "Glaucoma is a group of eye conditions that damage the optic nerve, the health of which is vital for good vision. This damage is often caused by an abnormally high pressure in your eye.",
        "causes": [
            "High internal eye pressure (intraocular pressure).",
            "Age (over 60).",
            "Family history of glaucoma.",
            "Thin corneas.",
            "Extreme nearsightedness or farsightedness."
        ],
        "symptoms": [
            "Patchy blind spots in your side (peripheral) or central vision.",
            "Tunnel vision in advanced stages.",
            "Severe headache.",
            "Eye pain.",
            "Nausea and vomiting."
        ],
        "precautions": [
            "Get regular dilated eye examinations.",
            "Know your family's eye health history.",
            "Wear eye protection.",
            "Take prescribed eyedrops regularly.",
            "Exercise safely."
        ],
        "doctor_advice": "Glaucoma damage can't be reversed. But treatment and regular checkups can help slow or prevent vision loss, especially if you catch the disease in its early stages.",
        "recommendation": "Urgent IOP check required. Visit a specialist."
    },
    {
        "name": "Diabetic Retinopathy",
        "overview": "Diabetic retinopathy is a diabetes complication that affects eyes. It's caused by damage to the blood vessels of the light-sensitive tissue at the back of the eye (retina).",
        "causes": [
            "Long-standing diabetes.",
            "Poor control of blood sugar level.",
            "High blood pressure.",
            "High cholesterol.",
            "Pregnancy."
        ],
        "symptoms": [
            "Spots or dark strings floating in your vision (floaters).",
            "Blurred vision.",
            "Fluctuating vision.",
            "Impaired color vision.",
            "Dark or empty areas in your vision."
        ],
        "precautions": [
            "Manage your diabetes.",
            "Monitor your blood sugar level.",
            "Keep your blood pressure and cholesterol under control.",
            "Pay attention to vision changes.",
            "Quit smoking."
        ],
        "doctor_advice": "Careful management of your diabetes is the best way to prevent vision loss. If you have diabetes, see your eye doctor for a yearly eye exam with dilation.",
        "recommendation": "Manage blood sugar levels and schedule a retinal exam."
    },
    {
        "name": "Conjunctivitis",
        "overview": "Conjunctivitis (pink eye) is an inflammation or infection of the transparent membrane (conjunctiva) that lines your eyelid and covers the white part of your eyeball.",
        "causes": [
            "Viruses.",
            "Bacteria.",
            "Allergies.",
            "A chemical splash in the eye.",
            "A foreign object in the eye."
        ],
        "symptoms": [
            "Redness in one or both eyes.",
            "Itchiness in one or both eyes.",
            "A gritty feeling in one or both eyes.",
            "A discharge that forms a crust during the night.",
            "Tearing."
        ],
        "precautions": [
            "Don't touch your eyes with your hands.",
            "Wash your hands often.",
            "Use a clean towel and washcloth daily.",
            "Don't share towels or washcloths.",
            "Change your pillowcases often."
        ],
        "doctor_advice": "Treatment depends on the cause. Bacterial pink eye may need antibiotic drops. Viral pink eye often clears up on its own. Allergic pink eye can be helped with specific eyedrops.",
        "recommendation": "Use prescribed eye drops and maintain hygiene."
    },
    {
        "name": "Normal",
        "overview": "Your eyes appear healthy with no visible signs of common diseases.",
        "causes": ["Healthy lifestyle.", "Regular checkups.", "Good hygiene."],
        "symptoms": ["Clear vision.", "No pain or redness.", "Good peripheral vision."],
        "precautions": [
            "Maintain a healthy diet.",
            "Wear sunglasses.",
            "Rest your eyes from screens (20-20-20 rule).",
            "Stay hydrated."
        ],
        "doctor_advice": "Keep up the good work! Continue with regular comprehensive eye exams to ensure your eyes remain healthy.",
        "recommendation": "Eyes look healthy. Maintain regular checkups."
    }
]

@app.route('/api/predict', methods=['POST'])
def predict():
    # Simulate processing delay for realism
    time.sleep(1.5)
    
    # In a real app, we would process the image here.
    # For this prototype, we return a simulated result.
    
    # Randomly select a result (weighted slightly towards 'Normal' for realism)
    weights = [0.15, 0.15, 0.15, 0.15, 0.4]
    prediction = random.choices(DISEASES, weights=weights, k=1)[0]
    
    confidence = round(random.uniform(0.85, 0.99), 2)
    
    return jsonify({
        "disease": prediction["name"],
        "confidence": confidence,
        "status": "Early-stage detected" if prediction["name"] != "Normal" else "Healthy",
        "data": prediction 
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
