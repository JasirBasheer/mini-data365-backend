from transformers import AutoModelForCausalLM, AutoTokenizer
   import sys
   import json

   model_name = "microsoft/Phi-3-mini-4k-instruct"
   tokenizer = AutoTokenizer.from_pretrained(model_name)
   model = AutoModelForCausalLM.from_pretrained(model_name)

   def parse_query(query):
       prompt = f"Extract the niche, follower range, and platforms from this query: '{query}'"
       inputs = tokenizer(prompt, return_tensors="pt")
       outputs = model.generate(**inputs, max_length=100)
       text = tokenizer.decode(outputs[0], skip_special_tokens=True)
       niche = "tech" if "tech" in text.lower() else "other"
       min_followers = 40000 if "40k" in text.lower() else 0
       max_followers = 100000 if "100k" in text.lower() else 1000000
       platforms = ["Instagram", "YouTube"] if "instagram" in text.lower() and "youtube" in text.lower() else ["Instagram"]
       return {"niche": niche, "min_followers": min_followers, "max_followers": max_followers, "platforms": platforms}

   def detect_niche(text):
       prompt = f"Classify the niche of this text: '{text}'. Options: tech, beauty, fashion, travel, other."
       inputs = tokenizer(prompt, return_tensors="pt")
       outputs = model.generate(**inputs, max_length=50)
       text = tokenizer.decode(outputs[0], skip_special_tokens=True)
       return "tech" if "tech" in text.lower() else "other"

   if __name__ == "__main__":
       input_data = sys.argv[1] if len(sys.argv) > 1 else ""
       if input_data:
           try:
               data = json.loads(input_data)
               if data.get("type") == "query":
                   result = parse_query(data.get("text", ""))
               else:
                   result = {"niche": detect_niche(data.get("text", ""))}
               print(json.dumps(result))
           except Exception as e:
               print(json.dumps({"error": str(e)}))
       else:
           print(json.dumps({"error": "No input provided"}))