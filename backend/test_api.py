"""
Test script for VerityAI API
Run this to test your backend without using the frontend
"""

import requests
import json

# Configuration
API_URL = "http://localhost:8000"

# Test content samples
test_cases = {
    "realistic": """
    Building a successful career in technology requires dedication and continuous learning.
    Here are some realistic steps:
    1. Start with fundamentals and master them
    2. Build projects to demonstrate your skills
    3. Network with professionals in your field
    4. Apply for internships or entry-level positions
    5. Keep learning and stay updated with industry trends
    Remember, everyone's journey is unique and it's okay to make mistakes along the way.
    """,
    
    "exaggerated": """
    Wake up at 5 AM every single day and you'll become a millionaire within a year!
    I did it, so can you! Just follow my exact routine:
    - Hustle 18 hours every day
    - Learn 5 programming languages simultaneously
    - Build 10 startups at once
    - Never take breaks or vacations
    Sleep is overrated anyway! If you're not grinding 24/7, you're already behind!
    """,
    
    "misleading": """
    ATTENTION: You're completely wasting your life if you're not making $10,000/month by age 20!
    Here's my secret formula that's GUARANTEED to work:
    1. Drop out of school immediately (you don't need education)
    2. Invest your entire savings in cryptocurrency
    3. Work non-stop without any breaks or sleep
    4. Anyone who tells you to take it slow is a HATER
    Success is 100% guaranteed if you follow these steps! Don't listen to anyone else!
    """
}

def test_health_check():
    """Test if the API is running"""
    print("\n" + "="*60)
    print("Testing Health Check Endpoint")
    print("="*60)
    
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_analysis(content_type, content):
    """Test the analysis endpoint"""
    print("\n" + "="*60)
    print(f"Testing Analysis: {content_type.upper()}")
    print("="*60)
    
    try:
        response = requests.post(
            f"{API_URL}/analyze",
            json={"content": content},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n📊 Category: {result['category']}")
            print(f"\n📝 Explanation:\n{result['explanation']}")
            print(f"\n🔍 Key Findings:")
            for finding in result['key_findings']:
                print(f"  - {finding}")
            print(f"\n⚠️ Red Flags:")
            for flag in result['red_flags']:
                print(f"  - {flag}")
            print(f"\n💡 Recommendation:\n{result['recommendation']}")
            
            # --- UPDATE HERE: Using truth_score instead of confidence ---
            print(f"\n🎯 Authenticity Score: {result['truth_score']}/100") 
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def run_all_tests():
    """Run all tests"""
    print("\n🚀 Starting VerityAI API Tests")
    print(f"📍 API URL: {API_URL}")
    
    # Test health check
    if not test_health_check():
        print("\n❌ Backend is not running!")
        print("Please start the backend with: python main.py")
        return
    
    print("\n✅ Backend is running!")
    
    # Test all content types
    results = []
    for content_type, content in test_cases.items():
        success = test_analysis(content_type, content)
        results.append((content_type, success))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    for content_type, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{content_type.ljust(15)}: {status}")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    run_all_tests()