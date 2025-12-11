# 🔍 Vérification OpenAI sur Vercel

Guide pour diagnostiquer et résoudre les problèmes liés à OpenAI en production sur Vercel.

## 🚨 Symptômes du Problème

Si vous voyez l'erreur :
- `"Unexpected token 'F', "Forbidden "... is not valid JSON"`
- `Erreur lors de l'analyse`
- `Service d'analyse temporairement indisponible`

Cela indique probablement un problème avec la configuration OpenAI.

## ✅ Checklist de Vérification

### 1. Vérifier la Variable d'Environnement sur Vercel

**Étapes :**
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `Dataxx-B2C`
3. Allez dans **Settings** > **Environment Variables**
4. Cherchez `OPENAI_API_KEY`

**Vérifier :**
- ✅ La variable existe
- ✅ Elle est définie pour **Production**, **Preview**, et **Development**
- ✅ La valeur commence par `sk-` (clé API OpenAI valide)
- ✅ Il n'y a pas d'espaces avant/après la valeur
- ✅ La valeur n'est pas `undefined` ou vide

**Format attendu :**
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Vérifier la Clé API OpenAI

**Tester la clé localement :**
```bash
# Dans votre terminal
export OPENAI_API_KEY="votre_cle_api"
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Si ça fonctionne :**
- La clé est valide ✅
- Le problème vient de la configuration Vercel

**Si ça ne fonctionne pas :**
- La clé est invalide ou expirée ❌
- Générez une nouvelle clé sur https://platform.openai.com/api-keys

### 3. Redéployer après Ajout de Variable

**Important :** Après avoir ajouté/modifié une variable d'environnement sur Vercel, vous devez redéployer :

**Option 1 : Via Dashboard**
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Sélectionnez **Redeploy**

**Option 2 : Via Git**
```bash
# Faire un commit vide pour déclencher un nouveau déploiement
git commit --allow-empty -m "trigger redeploy for env vars"
git push
```

**Option 3 : Via CLI**
```bash
vercel --prod
```

### 4. Vérifier les Logs Vercel

**Consulter les logs en temps réel :**
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **Deployments** > Sélectionnez le dernier déploiement
4. Cliquez sur **Functions** > `/api/upload-deck`
5. Regardez les logs lors d'un upload

**Chercher :**
- `❌ OPENAI_API_KEY n'est pas définie` → Variable manquante
- `Clé API OpenAI invalide` → Clé invalide
- `403 Forbidden` → Clé invalide ou quota dépassé
- `401 Unauthorized` → Clé invalide

## 🔧 Solutions aux Problèmes Courants

### Problème 1 : Variable OPENAI_API_KEY manquante

**Symptôme :**
```
Service d'analyse temporairement indisponible. OPENAI_API_KEY n'est pas configurée.
```

**Solution :**
1. Allez sur Vercel Dashboard > Settings > Environment Variables
2. Cliquez sur **Add New**
3. Nom : `OPENAI_API_KEY`
4. Valeur : Votre clé API OpenAI (commence par `sk-`)
5. Sélectionnez **Production**, **Preview**, **Development**
6. Cliquez sur **Save**
7. **Redéployez** l'application

### Problème 2 : Clé API invalide ou expirée

**Symptôme :**
```
Clé API OpenAI invalide ou manquante. Vérifiez la variable OPENAI_API_KEY sur Vercel.
```

**Solution :**
1. Allez sur https://platform.openai.com/api-keys
2. Vérifiez que votre clé est active
3. Si nécessaire, créez une nouvelle clé
4. Mettez à jour la variable sur Vercel
5. Redéployez

### Problème 3 : Quota OpenAI dépassé

**Symptôme :**
```
Quota OpenAI dépassé. Veuillez réessayer plus tard.
```

**Solution :**
1. Allez sur https://platform.openai.com/account/billing
2. Vérifiez votre crédit disponible
3. Ajoutez des crédits si nécessaire
4. Vérifiez les limites de dépenses

### Problème 4 : Variable définie mais pas accessible

**Symptôme :**
- Variable existe sur Vercel
- Mais l'erreur persiste

**Solution :**
1. Vérifiez que la variable est définie pour **Production** (pas seulement Preview)
2. Redéployez explicitement en production
3. Vérifiez qu'il n'y a pas de fautes de frappe (`OPENAI_API_KEY` et non `OPENAI_API`)

## 🧪 Test de Diagnostic

**Créer un endpoint de test :**

```typescript
// pages/api/test-openai.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const checks = {
    openaiKeyExists: !!process.env.OPENAI_API_KEY,
    openaiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    openaiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 3) || 'N/A',
    nodeEnv: process.env.NODE_ENV,
  };

  res.status(200).json(checks);
}
```

**Tester :**
```bash
curl https://votre-domaine.vercel.app/api/test-openai
```

**Résultat attendu :**
```json
{
  "openaiKeyExists": true,
  "openaiKeyLength": 51,
  "openaiKeyPrefix": "sk-",
  "nodeEnv": "production"
}
```

## 📋 Checklist Finale

Avant de tester l'upload de deck :

- [ ] Variable `OPENAI_API_KEY` existe sur Vercel
- [ ] Variable définie pour **Production**
- [ ] Clé API commence par `sk-`
- [ ] Application redéployée après ajout/modification de la variable
- [ ] Crédits OpenAI disponibles
- [ ] Logs Vercel ne montrent pas d'erreurs OpenAI

## 🆘 En Cas de Problème Persistant

1. **Vérifier les logs Vercel** → Dashboard > Deployments > Functions > Logs
2. **Tester la clé localement** → `curl` avec votre clé API
3. **Vérifier OpenAI Dashboard** → https://platform.openai.com/usage
4. **Créer un endpoint de test** → Pour diagnostiquer le problème

## 🔗 Liens Utiles

- **Vercel Dashboard** : https://vercel.com/dashboard
- **OpenAI API Keys** : https://platform.openai.com/api-keys
- **OpenAI Usage** : https://platform.openai.com/usage
- **OpenAI Billing** : https://platform.openai.com/account/billing

