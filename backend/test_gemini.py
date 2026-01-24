import google.generativeai as genai
import os

API_KEY = "AIzaSyCHoP2pFhdjt3qmsoC4zHfTdcIVJPkSMlc"

def test_gemini():
    print(f"[*] Configuring Gemini with Key ending in ...{API_KEY[-4:]}")
    genai.configure(api_key=API_KEY)
    
    print("[*] Listing models...")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"    - {m.name}")
    except Exception as e:
        print(f"[!] Error listing models: {e}")
        return

    print("\n[*] Testing generation with 'gemini-pro'...")
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Write a 5 word headline about Silver prices.")
        print(f"    > Response: {response.text}")
        print("[+] SUCCESS")
    except Exception as e:
        print(f"[!] Generation failed: {e}")

if __name__ == "__main__":
    test_gemini()
