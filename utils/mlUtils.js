import { PythonShell } from 'python-shell';

   export async function processQuery(query) {
     return new Promise((resolve, reject) => {
       PythonShell.run('ml/phi3Mini.py', { args: [JSON.stringify({ type: 'query', text: query })] }, (err, results) => {
         if (err) return reject(err);
         resolve(JSON.parse(results[0]));
       });
     });
   }

   export async function detectNiche(text) {
     return new Promise((resolve, reject) => {
       PythonShell.run('ml/phi3Mini.py', { args: [JSON.stringify({ type: 'niche', text: text })] }, (err, results) => {
         if (err) return reject(err);
         resolve(JSON.parse(results[0]));
       });
     });
   }

   export async function detectFraud(metrics) {
     return new Promise((resolve, reject) => {
       PythonShell.run('ml/fraudDetection.py', { args: [JSON.stringify(metrics)] }, (err, results) => {
         if (err) return reject(err);
         resolve(JSON.parse(results[0]));
       });
     });
   }