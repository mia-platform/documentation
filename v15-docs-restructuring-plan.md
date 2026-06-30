# Analisi: Documentazione da ristrutturare per v15

Con v15 ogni prodotto (Console, Services, AI Foundry, Catalog, Keycloak, Keycloak Realm Management) ha la propria Helm chart dedicata. La documentazione attuale è ancora centrata sulla sola chart `mia-console`. Di seguito i punti critici, raggruppati per area.

---

## A — Requirements / Self-Hosted: sezione `installation-chart`

**1. `docs/requirements/self-hosted/installation-chart/100_how-to-upgrade.md`**
Parla esclusivamente di aggiornare la versione di `mia-console` nel `Chart.yaml`. Con v15 ogni chart va aggiornata indipendentemente. La pagina deve diventare un hub che:

- spiega il modello "one upgrade per product chart"
- punta a guide di upgrade dedicate per ciascun prodotto (Console, Keycloak, Keycloak Realm Management, Services, AI Foundry, Catalog)
- descrive l'ordine di aggiornamento consigliato tra le chart (es. Keycloak prima di Console)

**2. `docs/requirements/self-hosted/installation-chart/15_getting-started.md`**
Il flusso di getting started culmina in un singolo `helm install … mia-platform/mia-console`. Con più chart, il getting started deve essere ristrutturato in fasi (o split per prodotto), indicando almeno:

- prerequisiti condivisi (PostgreSQL per Keycloak, MongoDB per Console, Redis)
- ordine di installazione delle chart
- dipendenze cross-chart (es. Keycloak deve essere up prima che Console possa configurare il suo auth provider OIDC)

**3. Struttura stessa di `installation-chart/` (singolare → plurale)**
Il nome e la struttura della directory implica una sola chart. Andrebbe rinominata in qualcosa come `installation-charts/` o `self-hosted-installation/` e suddivisa in sotto-sezioni per prodotto, ciascuna con: getting-started, helm-values, how-to-upgrade, key-concepts.

**4. `docs/requirements/self-hosted/self-hosted-requirements.md`**
L'architettura illustrata mostra Mia-Platform come blocco unico. Con v15:

- l'immagine architetturale va aggiornata per mostrare i prodotti separati nei loro namespace (pattern `{product}-{environment}` come da `auth-notes/namespaces.md`)
- la tabella dei requisiti di risorse deve includere risorse per ciascuna chart dedicata (Keycloak/PostgreSQL ha requisiti propri distinti da MongoDB per Console)
- la sezione dei cluster sizing examples non include lo stack Keycloak/Services

---

## B — Release Notes

**5. `release-notes/mia-platform-v15.mdx`**
Descrive le nuove funzionalità (Context Catalog, Flow, AI Foundry) ma non fa mai riferimento alle versioni specifiche delle singole Helm chart che compongono la release. Ogni nota di rilascio dovrebbe indicare una tabella tipo "Bill of Materials" con la versione di ciascuna chart (es. `mia-console vX.Y.Z`, `keycloak-chart vA.B.C`, `keycloak-realm-management vD.E.F`, ecc.).

**6. `release-notes/security.md`**
Le immagini firmate con `cosign` e gli SBOM sono oggi riferiti solo a componenti della Console. Con chart dedicate, ogni prodotto porta le proprie immagini (Keycloak custom image, servizi AI Foundry, servizi Catalog…) e queste vanno censite: firma cosign, SBOM, procedura di verifica — per ogni chart.

---

## C — Nuove sezioni mancanti

**7. Guida installazione Keycloak**
Non esiste in documentazione. I contenuti di `auth-notes/installation.md` coprono già: provisioning PostgreSQL, bootstrap admin credentials, gestione segreti/vault, upload manifest Kubernetes. Questa guida dovrebbe vivere in una nuova sezione dedicata alla chart Keycloak (es. `requirements/self-hosted/keycloak/`), strutturata in:

- Prerequisiti (PostgreSQL, namespace, secrets)
- Installazione chart Keycloak (operator + server)
- Installazione chart Keycloak Realm Management
- Configurazione vault/secrets per realm
- Come aggiornare Keycloak

**8. Strategie di federazione/autorizzazione Keycloak**
Il documento `keycloak-realm-management/docs/30_mia_platform_authorization_strategies.md` descrive tre strategie per integrare Keycloak con l'IdP del cliente (Managed Keycloak, Customer-Owned Keycloak, Single-Realm Constraint). È un contenuto interno e non è mai stato pubblicato nella documentazione pubblica. Con v15 e la distribuzione di una chart Keycloak dedicata, è indispensabile che i clienti self-hosted abbiano accesso a questa guida per scegliere la strategia corretta.

**9. Architettura dei realm Keycloak**
Il contenuto di `keycloak-realm-management/docs/10_overview.md` e `20_console.md` (dual-realm `mia-platform` / `mia-extensions`, client policies, organizzazioni, IdP federation) deve trovare posto nella documentazione pubblica, almeno come reference architetturale. I clienti self-hosted che scelgono Strategy 1 o 2 hanno bisogno di capire cosa viene deployato nei realm.

**10. Guide installazione/upgrade per-prodotto: Services, AI Foundry, Catalog**
Le sezioni `docs/products/ai-foundry/`, `docs/products/context-catalog/`, `docs/products/flow/` non hanno sottosezioni dedicate all'installazione self-hosted. Ogni prodotto con una chart propria ne ha bisogno.

**11. Layout namespace e DNS multi-prodotto**
Il contenuto di `auth-notes/namespaces.md` (pattern `{product}-{environment}`, separazione cluster `tools`/`console`/`console-noprod`, DNS per tier) non è documentato pubblicamente. Per i clienti self-hosted è informazione strutturale: come organizzare i namespace Kubernetes, come pianificare il DNS, come strutturare gli ambienti (production, preview, demo, lts, preproduction, development, experimental).

---

## D — Prodotti: sezioni self-hosted mancanti in `docs/products/`

**12. `docs/products/console/` — configurazione Keycloak come auth provider**
Oggi la getting-started configura un auth provider OAuth2 generico (Okta). Con v15 il provider canonico self-hosted è Keycloak. Serve documentare come collegare Console alla chart Keycloak (OIDC client `console-website-bff`, JWKS URL, scopes, etc.) — informazioni che oggi vivono solo in `keycloak-realm-management/docs/20_console.md`.

**13. Helm values per-prodotto**
Il sotto-albero `installation-chart/helm-values/` è interamente dedicato a `mia-console`. Ogni nuova chart (Keycloak, Services, AI Foundry, Catalog) deve avere la sua sezione `helm-values/` con la documentazione dei parametri.

---

## E — Console chart: rottura con il modello di autenticazione precedente

**14. Breaking change: da Authentication Service a Keycloak**
Il branch `feat/external-idp` della console-helm-chart introduce una rottura strutturale: il provider di autenticazione non è più il servizio interno `authentication-service` ma Keycloak esterno. La chart stessa lo documenta in `docs/100_How-To-Upgrade.md` come breaking change "Unreleased". La documentazione pubblica deve:

- Descrivere il passaggio al nuovo modello in una sezione dedicata "migrazione da v14 a v15"
- Documentare i nuovi valori obbligatori: `configurations.keycloak.protocol`, `configurations.keycloak.host`, `configurations.keycloak.realm`, `configurations.keycloak.extensibilityRealm`
- Documentare come configurare i due client OIDC (`console-website-bff`, `console-cms-bff`) in Keycloak: `private_key_jwt`, JWKS URL, redirect URI, scopes

**15. Cambio formato Redis nella Console chart**
Sempre come breaking change v14→v15: `configurations.redis.hosts` passa da stringa a array di oggetti `{ip, port}`. Va documentato nella guida di upgrade Console.

**16. Docs nella chart vs documentazione pubblica: processo di sincronizzazione**
La `console-helm-chart` contiene una cartella `docs/` con file (`15_Getting-Started.md`, `100_How-To-Upgrade.md`, `25_Authentication-Provider.md`, ecc.) che sono la fonte primaria di verità per quella chart. Gli stessi file esistono specchiati nel repo `documentation/`. Serve definire e documentare un processo chiaro di sincronizzazione, altrimenti le due versioni divergeranno. Tutte le nuove chart (Services, Catalog, AI Foundry, Keycloak) dovranno adottare lo stesso pattern.

---

## F — Dipendenze cross-prodotto e infrastruttura condivisa

**17. Keycloak è prerequisito di TUTTI i prodotti, non solo di Console**
Dall'analisi dei `values.yaml` di Services, Catalog e AI Foundry emerge che tutti hanno un campo `authorizationServer.issuer` che punta a Keycloak, e tutti includono un'istanza del componente `authtool-bff` configurato con l'issuer Keycloak. La documentazione self-hosted deve comunicare con chiarezza che **Keycloak deve essere installato per primo**, prima di qualsiasi altro prodotto.

**18. AI Foundry dipende da Catalog**
La chart `ai-foundry-helm-chart` espone i valori `catalogCluster` e `catalogUrl`, che indicano una dipendenza esplicita verso il Catalog. Questa dipendenza inter-prodotto non è documentata pubblicamente e deve essere inclusa in:

- La guida di installazione di AI Foundry (Catalog è prerequisito)
- La guida di upgrade (l'ordine conta: Catalog prima di AI Foundry)
- Una eventuale pagina di architettura generale multi-prodotto

**19. Traefik come requisito infrastrutturale comune**
Tutte e cinque le chart usano `ingressRoute` (Traefik `IngressRoute`), non l'`Ingress` standard Kubernetes. Traefik deve essere documentato come **requisito infrastrutturale condiviso** nella pagina `self-hosted-requirements.md` (oggi non è menzionato come obbligatorio, solo come opzionale per la Console).

**20. `authtool-bff` come componente condiviso**
L'immagine `nexus.mia-platform.eu/platform/auth/authtool/authtool-bff:0.5.0` è deployata da Console, Services, Catalog e AI Foundry in modo indipendente ma con lo stesso pattern (`private_key_jwt`, Redis cache, cookie signing). Nel Bill of Materials delle release notes questa immagine è shared e deve essere referenziata come tale, non per ogni prodotto separatamente.

---

## G — Requisiti infrastrutturali per-prodotto (dettaglio granulare)

**21. Matrice DB/infra per chart**
Nessun documento pubblico descrive i requisiti infrastrutturali specifici per ciascuna chart. Dall'analisi dei `values.yaml` emerge questa matrice, che deve diventare una tabella nella documentazione:

| Chart | PostgreSQL | MongoDB | Redis | Kafka | Keycloak | Catalog |
| --- | --- | --- | --- | --- | --- | --- |
| Keycloak | ✅ (esterno) | ❌ | ❌ | ❌ | — | ❌ |
| Console | ❌ | ✅ (esterno) | ✅ (esterno) | ❌ | ✅ | ❌ |
| Services | ❌ | ❌ | ✅ (interno) | ❌ | ✅ | ❌ |
| Catalog | ✅ (esterno) | ✅ (esterno) | ✅ (interno) | ✅ (opz.) | ✅ | ❌ |
| AI Foundry | ✅ (esterno) | ❌ | ✅ (interno) | ❌ | ✅ | ✅ |

### 22. Gestione secrets: modello non uniforme tra le chart

- **keycloak-chart**: integrazione ESO (ExternalSecret Operator) nativa per vault e keystore
- **console-helm-chart**: secrets come valori plain nel `values.yaml`
- **services / catalog / ai-foundry**: secrets come valori plain con sezione dedicata `secrets.*`

La documentazione self-hosted deve coprire come gestire i secrets per ciascuna chart in un contesto produzione (almeno con ESO, idealmente con un paragrafo sulle alternative — Vault, sealed-secrets, ecc.).

---

## Piano aggiornato (allineato alla ristrutturazione v15)

### 1) Macro-obiettivo

La ristrutturazione v15 viene organizzata su due macro-sezioni:

- **Requirements / Self-Hosted**: da struttura Console-centrica a struttura product-suite.
- **Release Notes templating**: introduzione sistematica di versioni chart e riferimenti SBOM per prodotto.

---

### 2) Nuova Information Architecture per Requirements

All'ingresso della sezione Requirements, i contenuti vengono organizzati in questo modo:

1. **Overview (cross-prodotto)**
	- spiega il modello v15: una chart per prodotto
	- espone vincoli infrastrutturali condivisi
	- include una tabella "tool infrastrutturale × prodotto" (Traefik, Keycloak, PostgreSQL, MongoDB, Redis, Kafka, Vault/ESO)
	- esplicita ordine installativo raccomandato e dipendenze globali

2. **Installation Guidelines (cartella contenitore)**
	- pagina overview iniziale con dipendenze cross-prodotto (prima dei dettagli per prodotto)
	- sottocartelle per prodotto: Console, Keycloak, Keycloak Realm Management, Services, Catalog, AI Foundry

3. **Blueprint standard per ogni prodotto**
	- overview chart e perimetro funzionale
	- prerequisiti infrastrutturali specifici
	- getting started / installazione
	- how-to-upgrade
	- helm-values (anche come sub-folder)

4. **Migrazione contenuti esistenti**
	- i contenuti oggi presenti in `requirements/self-hosted/installation-chart/*` vengono inglobati nel ramo prodotto **Console**

---

### 3) Riallineamento blocchi analisi

#### Blocco A

Da aggiornare integralmente per riflettere la nuova IA:

- superamento del modello `installation-chart` singolare
- introduzione di `Installation Guidelines` con alberatura per prodotto
- separazione netta tra contenuti cross-prodotto e contenuti per-prodotto

#### Blocco B

Confermato **invariato** come impostazione funzionale:

- la sezione resta focalizzata su templating release notes
- da implementare tabella Bill of Materials chart + riferimenti SBOM per prodotto

#### Blocchi C + D

Da accorpare nel ramo **Keycloak/Auth Management** della nuova struttura:

- guida installazione Keycloak
- strategie di federazione/autorizzazione
- architettura realm
- integrazione Console ↔ Keycloak come provider canonico self-hosted

#### Blocco E

Da integrare in **How-To-Upgrade Console**:

- migrazione v14 → v15 da authentication-service interno a Keycloak
- nuovi valori obbligatori `configurations.keycloak.*`
- configurazione client OIDC (`console-website-bff`, `console-cms-bff`)
- breaking change Redis (`configurations.redis.hosts` da stringa a array oggetti)

#### Blocco F

Da spostare in **Overview di Installation Guidelines** (prima dei rami prodotto):

- Keycloak prerequisito globale
- dipendenze tra prodotti (es. Catalog prima di AI Foundry)
- Traefik requisito infrastrutturale condiviso
- componenti condivisi e pattern comuni

---

### 4) Priorità operativa (nuova)

| Priorità | Workstream | Include |
| --- | --- | --- |
| 🔴 Alta | Requirements IA redesign | Nuova overview, nuova cartella Installation Guidelines, migrazione contenuti Console (Blocco A) |
| 🔴 Alta | Keycloak/Auth management docs | Accorpamento C+D nel ramo Keycloak con installazione + strategie + realm architecture |
| 🔴 Alta | Console Upgrade v14→v15 | Aggiornamento how-to-upgrade con breaking changes auth/redis (Blocco E) |
| 🔴 Alta | Cross-product dependencies overview | Inserimento contenuti Blocco F nella overview di Installation Guidelines |
| 🟡 Media | Release notes templating evolution | BOM chart + riferimenti SBOM per prodotto (Blocco B, già validato) |
| 🟡 Media | Requisiti infra granulari | Matrice DB/infra e chiarimenti secrets model per chart |
| 🟢 Bassa | Governance sincronizzazione docs | Processo chart docs ↔ documentazione pubblica |

---

### 5) Output atteso del piano

1. Requirements ristrutturata in chiave multi-chart, con separazione chiara tra overview globale e guide per prodotto.
2. Ramo Keycloak completo come polo unico per auth management self-hosted.
3. Guida upgrade Console aggiornata e allineata alle breaking changes v15.
4. Release notes pronte a includere BOM chart + SBOM per tutti i prodotti.

---

### 6) Primo passo operativo: struttura target e mapping

Questa sezione traduce il piano in una proposta concreta di struttura informativa, con mappatura iniziale dei file già esistenti.

#### 6.1 Struttura target (Requirements / Self-Hosted)

```text
docs/requirements/self-hosted/
	00_overview.md                                  # overview suite multi-chart, dipendenze globali, tabella tool x prodotto
	installation-guidelines/
		_category_.json
		00_overview.md                                # ordine installativo, prerequisiti cross-prodotto, matrice infra
		console/
			_category_.json
			10_overview.md
			15_getting-started.md
			100_how-to-upgrade.md
			helm-values/
				_category_.json
				... (contenuti console esistenti)
		keycloak/
			_category_.json
			10_overview.md
			15_getting-started.md
			100_how-to-upgrade.md
			110_auth-strategies.md
			120_realm-architecture.md
			helm-values/
				_category_.json
				10_installation-chart-example.md
				20_general-settings.md
				...
		keycloak-realm-management/
			_category_.json
			10_overview.md
			15_getting-started.md
			100_how-to-upgrade.md
			helm-values/
				_category_.json
		services/
			_category_.json
			10_overview.md
			15_getting-started.md
			100_how-to-upgrade.md
			helm-values/
				_category_.json
		catalog/
			_category_.json
			10_overview.md
			15_getting-started.md
			100_how-to-upgrade.md
			helm-values/
				_category_.json
		ai-foundry/
			_category_.json
			10_overview.md
			15_getting-started.md
			100_how-to-upgrade.md
			helm-values/
				_category_.json
```

Note di impostazione:

- La sezione `installation-chart/` diventa legacy e i contenuti vengono assorbiti sotto `installation-guidelines/console/`.
- Le dipendenze cross-prodotto (Blocco F) sono obbligatoriamente nella overview di `installation-guidelines/` prima dei rami per prodotto.
- I contenuti C+D confluiscono nel ramo `keycloak/` (auth management, strategie, realm).

#### 6.2 Mapping iniziale: contenuti attuali → nuova collocazione

| Stato attuale | Target proposto | Azione |
| --- | --- | --- |
| `docs/requirements/self-hosted/self-hosted-requirements.md` | `docs/requirements/self-hosted/00_overview.md` | Refactor contenuti in chiave multi-prodotto (tabella tool x prodotto, requisiti condivisi, architecture update) |
| `docs/requirements/self-hosted/installation-chart/15_getting-started.md` | `docs/requirements/self-hosted/installation-guidelines/console/15_getting-started.md` | Migrazione contenuto + revisione flow installazione v15 |
| `docs/requirements/self-hosted/installation-chart/100_how-to-upgrade.md` | `docs/requirements/self-hosted/installation-guidelines/console/100_how-to-upgrade.md` | Migrazione contenuto + integrazione breaking changes v14→v15 |
| `docs/requirements/self-hosted/installation-chart/110_key-concept.md` | `docs/requirements/self-hosted/installation-guidelines/console/110_key-concept.md` | Migrazione diretta (console scope) |
| `docs/requirements/self-hosted/installation-chart/helm-values/*` | `docs/requirements/self-hosted/installation-guidelines/console/helm-values/*` | Migrazione in blocco e allineamento naming |
| `auth-notes/installation.md` (fonte) | `docs/requirements/self-hosted/installation-guidelines/keycloak/15_getting-started.md` + `10_overview.md` | Porting contenuti installativi Keycloak |
| `keycloak-realm-management/docs/30_mia_platform_authorization_strategies.md` (fonte) | `docs/requirements/self-hosted/installation-guidelines/keycloak/110_auth-strategies.md` | Pubblicazione strategia auth self-hosted |
| `keycloak-realm-management/docs/10_overview.md` + `20_console.md` (fonti) | `docs/requirements/self-hosted/installation-guidelines/keycloak/120_realm-architecture.md` | Porting architettura realm e integrazione Console-Keycloak |

#### 6.3 Mapping iniziale: release notes templating

| Stato attuale | Target proposto | Azione |
| --- | --- | --- |
| `release-notes/mia-platform-v15.mdx` | `release-notes/mia-platform-v15.mdx` | Integrare tabella BOM chart per prodotto |
| `release-notes/security.md` | `release-notes/security.md` | Estendere sezione firme/SBOM da solo Console a tutti i prodotti |
| `scripts/release-notes/release-note-unreleased.mdx` | `scripts/release-notes/release-note-unreleased.mdx` | Aggiornare template release notes per includere chart versions + riferimenti SBOM |

#### 6.4 Sequenza di implementazione (primo ciclo)

1. Creare skeleton struttura `installation-guidelines/` con category file e pagine overview placeholder.
2. Migrare i file Console da `installation-chart/` a `installation-guidelines/console/` (senza perdita contenuto).
3. Inserire overview cross-prodotto con dipendenze globali (Keycloak-first, Catalog→AI Foundry, Traefik shared).
4. Preparare e collegare pagine Keycloak (installazione, strategie auth, realm architecture).
5. Aggiornare template release notes con campi BOM chart + SBOM references.

#### 6.5 Done definition del primo passo

- Esiste la nuova gerarchia `installation-guidelines` con rami per prodotto.
- I contenuti Console esistenti risultano ricollocati nel ramo Console.
- È presente una overview cross-prodotto prima delle pagine per prodotto.
- Esiste il ramo Keycloak con pagine minime per installazione e auth management.
- Il template release notes supporta esplicitamente chart versions e riferimenti SBOM.
