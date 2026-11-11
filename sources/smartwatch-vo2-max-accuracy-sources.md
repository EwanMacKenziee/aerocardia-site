# Sources — "When your watch says you're improving, should you believe it?"

Post: blog-smartwatch-vo2-max-accuracy.html (aerocardia-site-v2, branch blog/smartwatch-vo2-max-accuracy)
Target keyword: smartwatch vo2 max accuracy

## Claim → source

| Claim | Source | Depth read | Notes |
|---|---|---|---|
| Exercise-based VO2max estimates: average bias −0.09 mL/kg/min, individual range −9.9 to +9.7; resting-based: +2.17, range −13.1 to +17.4 | Molina-Garcia et al. 2022, Sports Med 52:1577–1597 (PMC9213394) | Reused from sources/fitness-data-gap-sources.md (abstract + network passage from full text) | Same paper and figures already verified for the Nov 4 post; figures match this draft exactly. |
| Funding/conflict disclosure for Molina-Garcia 2022 | Same as above | Reused | "This research was partly funded by Huawei Technologies Oy"; authors declared no conflict of interest; no author affiliation lists Huawei; INTERLIVE network includes Huawei Technologies. Repeated in the post per house rules. |
| Apple Watch underestimated VO2max by ~6 mL/kg/min on average (bias 6.07), MAE 6.92 mL/kg/min, MAPE 13.31%; authors call for refinement before clinical use | Lambe, O'Grady, Baldwin, Doherty. "Investigating the accuracy of Apple Watch VO2 max measurements: a validation study." PLOS ONE 2025;20(5):e0323741 (PMC12080799 / PMID 40373042) | Verified via search against abstract + full-text figures this session | Confirms the draft's numbers (6 mL/kg/min bias, 6.9 MAE, 13% MAPE) are accurate and internally consistent (bias and MAE are different statistics, not a contradiction). 30 participants, modified Åstrand protocol treadmill test. |
| Optical heart rate error during activity runs ~30% higher than at rest | Bent, Goldstein, Kibbe, Dunn. "Investigating sources of inaccuracy in wearable optical heart rate sensors." npj Digital Medicine 2020;3:18 (PMC7010823) | Verified via search this session | Confirmed exact figure. No reported skin-tone accuracy difference (disputed in a later Matters Arising, not relevant to this claim). |
| 3.5 mL/kg/min = 1 MET | General exercise-physiology convention (ACSM) | Not separately cited in final post | See "Resolved issue" below — the post no longer attaches a claim about "meaningful improvement" to this conversion, so no citation is needed for the arithmetic itself. |

## Resolved issue (not escalated)

The user's draft originally cited Lang JJ et al., "Cardiorespiratory fitness is a strong and consistent predictor of morbidity and mortality among adults: an overview of meta-analyses," BJSM 2024 (ref [3]), to support: "a gain of [3.5 mL/kg/min] is considered a meaningful improvement in fitness." I verified this paper is real (BJSM 58(10):556–566, DOI 10.1136/bjsports-2023-107849) and found it is explicitly about CRF–mortality/disease-risk associations (HRs for all-cause mortality, heart failure, CV mortality per MET).

CLAUDE.md: "No mortality, longevity, or disease-risk claims, even if cited." Citing a mortality-outcomes paper to justify "meaningful improvement in fitness" reads as smuggling a mortality claim in via citation. I cut this reference and reworded the sentence to a neutral unit-scale statement (3.5 mL/kg/min = 1 MET, a standard intensity unit; ±10 mL/kg/min ≈ 3 METs) with no health-outcome framing and no citation needed, since it's now plain arithmetic rather than a cited claim. This removed one reference from the original draft's numbered list (renumbered Bent 2020 from [4] to the post's third inline citation).

## Not reused from the Nov 4 source log

- Umbrella review on step-count/activity gains, Fuller 2020 review, HERITAGE Family Study, Hopkins typical-error definition, Etkin measurement-cost findings — not relevant to this post's narrower accuracy focus, left out.

## Other house-rule checks

- Banned-term scan (diagnose/detect/screen/treat/prevent/cure/patient/symptom/disease/clinical-grade/medical-grade/arrhythmia/afib/mortality/longevity/healthspan/guarantee-language/exaggeration-language/natural/unique-only): clean, no matches in body copy. Standard wellness disclaimer appears unchanged in the site-wide footer (not duplicated in-body, matching existing post convention).
- Wearables described only as "estimating" VO2max throughout; no "wrong/inaccurate" claim without a cited validation study.
- Garmin and Apple Watch mentioned neutrally, each backed by a cited study; no unsupported competitor attack.
- No individual training prescriptions; "how to tell real improvement from noise" steps are general interpretive guidance, not an individualized plan.
- No ARO2 mentions; pre-launch rules not implicated.
