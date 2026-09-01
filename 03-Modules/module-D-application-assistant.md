# Module D: Application Assistant

## Purpose
Scheme ke liye simple step-by-step application guidance dena.

## MVP Features
- Scheme Detail se **"आवेदन में मदद चाहिए"** button
- Generic text-based application checklist
- Steps ko session mein checkbox ki tarah mark kar sakte hain
- `schemes.json` mein future scheme-specific `applicationSteps` add kiye ja sakte hain
- Abhi koi real form-filling, auto-submit, payment automation ya tracking nahi hai

## Generic MVP Flow
1. CSC / Jan Seva Kendra जाएं
2. Required documents दिखाएं
3. Form भरवाएं
4. Fee दें — अगर official fee लागू हो
5. Receipt / acknowledgement लें

## Future
Agar kisi scheme ke specific steps available hon, to `applicationSteps` field se generic steps ko replace kiya ja sakta hai.
