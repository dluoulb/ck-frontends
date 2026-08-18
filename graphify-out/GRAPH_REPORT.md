# Graph Report - ck-frontends-aug-20  (2026-08-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1798 nodes · 5175 edges · 170 communities (102 shown, 68 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Source commit SHA: `207e1bb07640b6dfe34068133c87a89bb77536f7` (stored in `graphify-out/graph.json` and `graphify-out/manifest.json`).
- Compare `git rev-parse HEAD` with `jq -r '.graph.source_commit_sha' graphify-out/graph.json`; if they differ, the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 144
- Community 145
- Community 146
- Community 147
- Community 148
- Community 149
- Community 150
- Community 151
- Community 152
- Community 153
- Community 154
- Community 155
- Community 156
- Community 157
- Community 158
- Community 159
- Community 160
- Community 166

## God Nodes (most connected - your core abstractions)
1. `useEntity()` - 152 edges
2. `useApi()` - 107 edges
3. `formatCurrency()` - 84 edges
4. `useUser()` - 74 edges
5. `useToast()` - 70 edges
6. `useModal()` - 63 edges
7. `customRender()` - 57 edges
8. `useBorrowerDeps()` - 52 edges
9. `Loading()` - 46 edges
10. `fromISO()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `expectRedirectToUseCleanedLocation()` --calls--> `authRedirectLink()`  [EXTRACTED]
  __tests__/shared/components/layout/NavSignOut.test.tsx → shared/lib/constants/SiteVariables.ts
- `DocumentList()` --calls--> `useEntity()`  [EXTRACTED]
  apps/borrower/components/documents/document_list.tsx → shared/contexts/EntityContext.tsx
- `DocumentUploadForm()` --calls--> `useEntity()`  [EXTRACTED]
  apps/borrower/components/documents/document_upload_form.tsx → shared/contexts/EntityContext.tsx
- `DocumentUploadForm()` --calls--> `useApi()`  [EXTRACTED]
  apps/borrower/components/documents/document_upload_form.tsx → shared/hooks/useApi.ts
- `DocumentUploadForm()` --calls--> `useToast()`  [EXTRACTED]
  apps/borrower/components/documents/document_upload_form.tsx → shared/hooks/useToast.tsx

## Import Cycles
- 3-file cycle: `pages/_app.tsx -> shared/contexts/EntityContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 3-file cycle: `pages/_app.tsx -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardDetails.tsx -> apps/borrower/components/wallet/InactiveCardSection.tsx -> apps/borrower/components/wallet/virtual_card/InactiveVirtualCard.tsx -> apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardModalWrapper.tsx -> apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardDetails.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/contexts/EntityContext.tsx -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/contexts/BorrowerContext.tsx -> shared/contexts/EntityContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/components/layout/MainLayout.tsx -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/contexts/BorrowerContext.tsx -> shared/hooks/useStats.ts -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `apps/borrower/components/layout/PortalLayout.tsx -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx -> apps/borrower/components/layout/PortalLayout.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/contexts/BorrowerContext.tsx -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/contexts/BorrowerContext.tsx -> shared/hooks/usePaymentMethods.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/contexts/BorrowerContext.tsx -> shared/hooks/useActiveOrders.ts -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/contexts/BorrowerContext.tsx -> shared/hooks/useCompanyUsers.ts -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 4-file cycle: `pages/_app.tsx -> shared/contexts/BorrowerContext.tsx -> shared/hooks/useDefaultTerms.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 5-file cycle: `pages/_app.tsx -> shared/contexts/BorrowerContext.tsx -> shared/contexts/EntityContext.tsx -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx`
- 5-file cycle: `apps/borrower/components/layout/PortalLayout.tsx -> apps/borrower/hooks/useAuthorizedRoute.ts -> shared/contexts/EntityContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx -> apps/borrower/components/layout/PortalLayout.tsx`
- 5-file cycle: `apps/borrower/components/layout/PortalLayout.tsx -> shared/hooks/usePosthogIdentify.ts -> shared/contexts/EntityContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx -> apps/borrower/components/layout/PortalLayout.tsx`
- 5-file cycle: `apps/borrower/components/layout/PortalLayout.tsx -> shared/hooks/usePosthogPageView.ts -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx -> apps/borrower/components/layout/PortalLayout.tsx`
- 5-file cycle: `apps/borrower/components/layout/PortalLayout.tsx -> apps/borrower/components/layout/PossessUser.tsx -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx -> apps/borrower/components/layout/PortalLayout.tsx`
- 5-file cycle: `apps/borrower/components/layout/PortalLayout.tsx -> shared/hooks/useCustomerio.ts -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx -> apps/borrower/components/layout/PortalLayout.tsx`
- 5-file cycle: `apps/borrower/components/layout/PortalLayout.tsx -> shared/hooks/usePosthogIdentify.ts -> shared/contexts/UserContext.tsx -> shared/hooks/useApi.ts -> pages/_app.tsx -> apps/borrower/components/layout/PortalLayout.tsx`

## Communities (170 total, 68 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (23): Banner(), BannerProps, Benefits, comparisonFeatures, ComparisonTable(), CTA(), CTAProps, FAQs (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (31): ModalState, MultiUseVirtualCardDetails(), resolveActiveCard(), ActiveCardSection(), ActiveCardSectionProps, getStatusBadge(), CardAssets, InactiveCardSection() (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (31): SelectionWidget(), SuttonVcDisclosure(), PhysicalCardActivationModal(), visibleVirtualCardStatuses, Wallet(), shouldRefetchCompanyCardsOnMount(), shouldRetryCompanyCards(), useCompanyCards() (+23 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (46): apps/borrower/*, apps/reports/*, dom, dom.iterable, esnext, next.config.js, next-env.d.ts, node_modules (+38 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (23): BorrowerDashboard(), BorrowerOverview(), OverdueLoansBanner(), OverdueLoansBannerProps, CkaLink(), BillingCycleDisplay(), DefaultSettings(), SettingsWidget() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (16): adminUser, companyAmazonExclusive, documentA, documentB, merchant, orderA, tpsLoan1, tpsLoan3 (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (22): DashboardPCSection(), DashboardVCSection(), ActiveMultiUseVirtualCard(), MultiUseVirtualCard(), MultiUseVirtualCardProps, MultiUseVirtualCard(), ActivationBenefits(), ActivationBenefitsProps (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (25): SupportWidget(), SupportWidgetProps, MaskedVirtualCard(), FormErrors, FormValues, CardFinancialInfo(), CardFinancialInfoProps, columns (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (26): DefaultTermsDisplay(), DefaultTermSettingsModal(), DefaultVirtualCardTerms(), MultiUseVirtualCardDetailsModal(), ReturnsModal(), ManageCardModal(), ManageCardModalProps, ModalWrapper() (+18 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (22): AddFundsModal(), CardholderAgreementModal(), ConfirmMailingAddressModal(), MultiUseVCRulesModal(), MultiUseVirtualCardModalWrapper(), PhysicalCardModalWrapper(), SetDefaultTermsModal(), SetDefaultTermsModalProps (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (33): Accessibility, API and Data Fetching, Architecture Documentation, ARCHITECTURE.md Maintenance, Best Practices, Build and Development, Code Quality, Code Structure (+25 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (22): RedeemPointsModal(), RedeemPointsModalProps, Rewards(), RewardPointsWidget(), useRewardPointsBalance(), useRewardPointsLedger(), useActiveSubscription(), getRewardPointsBalance() (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.21
Nodes (13): EntityDetail(), EntityOverview(), MainDashboard(), OrderDashboard(), Attachments(), EntityInfo(), OwnerInfo(), EntityIndex() (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (18): PortalLayout(), PossessUser(), useAuthorizedRoute(), NotFound(), defaultState, TokenData, UserContext, UserState (+10 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (14): ActiveOrdersTable(), DashboardTableColumns(), AddNewUser(), ProfileIndex(), TODO: UX Decision, UserTableColumns, Users(), DocumentsTable() (+6 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (17): CardholderAgreement(), CardholderAgreementModalProps, MultiUseVCRulesModalProps, createVirtualCard(), CardType, initSessionSuppression(), posthogBeforeSend(), PosthogEvent (+9 more)

### Community 16 - "Community 16"
Cohesion: 0.11
Nodes (17): CreditKeyAnywhere(), TODO: SHOULD VIRTUAL CARDS BE MOVED TO ITS OWN PAGE??, ErrorAlert(), Home(), ckaLink, emailRegex, invalidRedirectPaths, jitEnabled (+9 more)

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (13): address(), highlightMatches(), ApplicationHit(), CompanyHit(), OrderHit(), UserHit(), HitTab(), NoResults() (+5 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (14): MarketplaceLink(), usePrimaryRoutes(), useSecondaryRoutes(), MobileNav(), TopNav(), marketplace, authRedirectLink(), CUSTOMERIO_INIT_OPTIONS (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.14
Nodes (15): CancelSubscriptionResponse, CancelSubscriptionVariables, CreateSubscriptionVariables, useSubscriptionPlans(), useSubscriptions(), cancelSubscription(), checkTrialEligibility(), createSubscription() (+7 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (12): RequestIncreaseModalProps, PlaidProps, PaymentMethodRecord, createManualReviewStatementFiles(), mockApi, mockCreateLimitIncreaseRequest, mockMakeToast, mockPlaidPaymentMethod (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (14): OrderOverview(), useOrderDependencies(), OrderIndex(), DocumentLink(), usePaymentSchedule(), useTransactions(), getAgreement(), getInvoice() (+6 more)

### Community 22 - "Community 22"
Cohesion: 0.16
Nodes (16): getDisplayStatus(), getPointsColor(), getRewardPercentage(), getStatusBadgeClass(), normalizeRewardType(), normalizeStatus(), RewardsActivityTable(), RewardsActivityTableProps (+8 more)

### Community 23 - "Community 23"
Cohesion: 0.16
Nodes (14): APP_VERSION(), autodeploy(), build_image(), check-terraform(), deploy(), import_terraform_vars(), inform(), push_image() (+6 more)

### Community 24 - "Community 24"
Cohesion: 0.19
Nodes (8): OrderStatus(), BuildStack(), OrderStatus(), TableColumns, OrderInfo(), ProductInfo(), Tooltip(), reformatDate()

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (15): getInitials(), getMerchantUrl(), isSafeUrl(), MERCHANT_TILE_UTM_PARAMS, MerchantCard(), MerchantCardProps, withMerchantTileUtmParams(), MerchantsSection() (+7 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (12): mockApi, mockRefetchPaymentMethods, MockResizeObserver, useCompanyUsers(), useStats(), getStats(), getCompanyUsers(), defaultTerms (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (11): ApiContext, queryClient, defaultState, QueryContext, QueryState, UserProvider(), api, headers (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.13
Nodes (19): createUserContextValue(), expectBorrowerSignOutAnalytics(), expectBorrowerSignOutCapturesAfterSignOut(), expectPrivilegedSignOutAnalytics(), expectRedirectToUseCleanedLocation(), expectRejectedBorrowerSignOutDoesNotCaptureOrReset(), expectRejectedPrivilegedSignOutDoesNotResetPostHog(), mockCapturePortalSessionEnded (+11 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (11): DocumentList(), DocumentUploadForm(), DocumentTableColumns, DOCUMENT_TYPE_LABELS, DOCUMENT_TYPES, FileUploader(), FileUploaderProps, DocumentIndex() (+3 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (11): ConfirmationData(), Stats(), AdditionalInfo(), MerchantInfo(), BuildStack(), TableColumns, BuildStack(), TableColumns (+3 more)

### Community 31 - "Community 31"
Cohesion: 0.15
Nodes (14): DefaultButton, BankForm(), BankFormValues, FormErrors, FormValues, generateBankAgreement(), updatePaymentMethod(), plaidEnabled (+6 more)

### Community 32 - "Community 32"
Cohesion: 0.16
Nodes (16): Plaid(), usePlaid(), createPaymentMethodBank(), createLinkToken(), setAccessToken(), defaultProps, fetchLinkToken, mockCreatePaymentMethodBank (+8 more)

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (13): CANCELLATION_REASONS, CancellationStep, CancelSubscriptionModal(), CancelSubscriptionModalProps, ManageSubscriptionButton(), ManageSubscriptionButtonProps, SubscriberOverview(), SubscriberOverviewProps (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.11
Nodes (17): CompanyOrAccountRecord, EntityContext, EntityProvider(), getAccount(), getCompany(), mockCreatePhysicalCard, mockUseCompanyPhysicalCard, mockUseEntity (+9 more)

### Community 35 - "Community 35"
Cohesion: 0.19
Nodes (9): CardTransactions(), CardTransactionsDisclosure(), AutoPayBanner(), UpdateTermsFormValues, UpdateTermsModalForm(), BorrowerInfo(), addMonths(), differenceOfDays() (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.17
Nodes (16): emptyManualStatementFileErrors(), emptyManualStatementFiles(), formatConnectedBankLabel(), getFileExtension(), isAcceptedManualBankStatementFile(), isValidRequestedAmount(), manualBankStatementAcceptAttribute, manualBankStatementAcceptedExtensions (+8 more)

### Community 37 - "Community 37"
Cohesion: 0.29
Nodes (8): ColumnInput(), Input(), MaskedField(), StickyCheckbox(), StickyInput(), StickySelect(), useInputs(), formStyles

### Community 38 - "Community 38"
Cohesion: 0.21
Nodes (13): DeletePmModal(), AddUserForm(), FormErrors, FormValues, DeleteUserModal(), OutlineButton(), OutlineButtonProps, toastStyles (+5 more)

### Community 39 - "Community 39"
Cohesion: 0.21
Nodes (4): BeneficialOwnerRecord, PaymentRecord, VirtualCardBalanceRecord, removeNulls()

### Community 40 - "Community 40"
Cohesion: 0.24
Nodes (10): ConfirmVCModal(), VCModalWrapper(), VCRulesModal(), VirtualCardForm(), FormErrors, FormValues, VirtualCardModal(), usePromo() (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.24
Nodes (11): CompleteModal(), PaymentModalForm(), ConfirmModal(), createPayment(), FormErrors, FormValues, PaymentsModal(), PaymentsModalWrapper() (+3 more)

### Community 42 - "Community 42"
Cohesion: 0.12
Nodes (17): babel-plugin-module-resolver, eslint, eslint-config-next, jest, devDependencies, babel-plugin-module-resolver, eslint, eslint-config-next (+9 more)

### Community 43 - "Community 43"
Cohesion: 0.24
Nodes (10): VCList(), AdditionalFeesDisclosure(), FeesDisplay(), useOrderFees(), calculateFeeTotals(), getCompressedFeeSummary(), getFeeBreakdownDisplay(), getFeeTitle() (+2 more)

### Community 44 - "Community 44"
Cohesion: 0.28
Nodes (10): AddressDetails(), findApp(), listOptions(), ApplicationDropdown(), Applications(), ApplicationStatus(), PendReasons(), useDropdown() (+2 more)

### Community 45 - "Community 45"
Cohesion: 0.17
Nodes (4): ApprovedTermRecord, CreditCardTransactionRecord, LoanRecord, OrderRecord

### Community 46 - "Community 46"
Cohesion: 0.45
Nodes (8): BuildStack(), NextPayment(), OrderTotalColumn(), TermsColumn(), BuildStack(), TermsCell(), formatShortDate(), formatInstallments()

### Community 47 - "Community 47"
Cohesion: 0.19
Nodes (7): DeleteButton, PaymentMethods(), BankPendHelp(), orderedScreens, PaymentMethodModalWrapper(), { useStepper }, PaymentMethodList()

### Community 48 - "Community 48"
Cohesion: 0.13
Nodes (13): Credit Key Frontends, Custom Theme Variables, Deployment environment variables, Getting Started, Installation, Introduction, Key Changes in v4, Screenshots (+5 more)

### Community 49 - "Community 49"
Cohesion: 0.17
Nodes (9): App(), GAQueueFunction, Scripts(), ZendeskChatLink(), platform(), iframedMerchants, Merchant, debugPlatforms (+1 more)

### Community 51 - "Community 51"
Cohesion: 0.25
Nodes (8): Orders(), TableColumns(), UpdateTermsModalWrapper(), isColumnVisible(), OrdersTable(), useOrders(), getOrders(), updatePaymentTerms()

### Community 52 - "Community 52"
Cohesion: 0.27
Nodes (8): BuildStack(), DownloadDocument(), TableColumns, useApplications(), buildUrl(), getApplications(), getDocuments(), getEntityDocument()

### Community 53 - "Community 53"
Cohesion: 0.16
Nodes (6): amazonPhysicalCardTest, amazonPhysicalCardTestEnabled, plusEnabled, LineIncreaseRequestAvailability, LineIncreaseRequestUnavailableReason, CreditLineRecord

### Community 54 - "Community 54"
Cohesion: 0.27
Nodes (9): RequestIncreaseUnavailableReason, requestIncreaseUnavailableTooltips, Stats(), BorrowerContext, BorrowerContextProvider(), useActiveOrders(), usePaymentMethods(), getActiveOrders() (+1 more)

### Community 55 - "Community 55"
Cohesion: 0.21
Nodes (7): PaymentProgress(), RewardsBalanceCard(), RewardsBalanceCardProps, ApprovedTerm, UpdateTermsSelect(), PrimaryButton(), PrimaryButtonProps

### Community 56 - "Community 56"
Cohesion: 0.39
Nodes (5): BorrowerDetails(), BuildStack(), DeleteUserButton(), formatPhoneNumber(), normalizePhone()

### Community 57 - "Community 57"
Cohesion: 0.17
Nodes (12): CK Frontends Architecture, Core Applications, Design Principles, Environment-Based URLs, Maintenance, Middleware Logic, Module Resolution (Path Aliases), Monorepo Structure (+4 more)

### Community 58 - "Community 58"
Cohesion: 0.31
Nodes (7): CreditCardForm(), CreditCardValidationMessages(), listOptions, PaymentMethodModal(), OrdersBadge(), useBorrowerDeps(), createPaymentMethodPi4Card()

### Community 59 - "Community 59"
Cohesion: 0.24
Nodes (9): ActivationModal(), ActivationModalProps, calculateTrialEndDate(), createPlanOptions(), planDurationMap, PlanOption, PlanType, planTypeLabels (+1 more)

### Community 60 - "Community 60"
Cohesion: 0.18
Nodes (11): axios, classnames, @fortawesome/react-fontawesome, dependencies, axios, classnames, @fortawesome/react-fontawesome, @radix-ui/react-select (+3 more)

### Community 61 - "Community 61"
Cohesion: 0.27
Nodes (4): Documents(), OrderOverview(), NoDataError(), getDocuments()

### Community 62 - "Community 62"
Cohesion: 0.31
Nodes (5): HowToUse(), PromoteDigitalWallet(), PromoteApp(), PromoteMarketplace(), mobileAppDownloadLink

### Community 63 - "Community 63"
Cohesion: 0.36
Nodes (5): PaymentScheduleDisclosure(), Schedule(), NoScheduleTimeline(), ScheduleTimeline(), getIcon()

### Community 64 - "Community 64"
Cohesion: 0.22
Nodes (9): 1. Monorepo vs. Multiple Repositories, 2. Next.js Framework, 3. TypeScript Adoption, 4. SuperTokens for Authentication, 5. Tailwind CSS for Styling, 6. React Query for Data Fetching, 7. Feature-Based Organization, 8. Subdomain-Based Multi-Tenancy (+1 more)

### Community 65 - "Community 65"
Cohesion: 0.31
Nodes (8): output.app_name, output.app_port, output.app_secret_arn, output.base_domain, output.memgb, output.route53_zone_id, output.vcpu, var.deploy_tier

### Community 66 - "Community 66"
Cohesion: 0.22
Nodes (9): scripts, build, dev, format, format:check, lint, lint:ci, start (+1 more)

### Community 69 - "Community 69"
Cohesion: 0.39
Nodes (5): Promo(), Promo(), PromoContext, PromoContextProvider(), usePromo()

### Community 70 - "Community 70"
Cohesion: 0.39
Nodes (4): Dropdown(), ListBox(), TableHeader(), exportOrders()

### Community 71 - "Community 71"
Cohesion: 0.25
Nodes (8): Authentication & Authorization, Core Framework & Language, Development & Testing, Monitoring & Analytics, Search & Data, State Management & Data Fetching, Technology Stack, UI & Styling

### Community 72 - "Community 72"
Cohesion: 0.25
Nodes (8): Code Quality Tools, Development Commands, Development Workflow, Docker Development, Import Order Convention, Local Development Setup, Prerequisites, Required Repositories

### Community 73 - "Community 73"
Cohesion: 0.64
Nodes (7): local.domain, local.full_subdomain, module.app-vars, module.ck-frontends-domain, module.ck-shared-vars, var.deploy_tier, var.subdomain

### Community 74 - "Community 74"
Cohesion: 0.25
Nodes (8): overrides, brace-expansion, diff, glob, minimatch, picomatch, postcss, qs

### Community 75 - "Community 75"
Cohesion: 0.25
Nodes (4): consumerAccount, mockMakeToast, mockRequestIncreaseModal, mockUseToast

### Community 76 - "Community 76"
Cohesion: 0.29
Nodes (7): API Client Architecture, API Client Configuration, Backend Integration, Borrower Request Increase Flow, Data Fetching Pattern, Data Flow & API Integration, PostHog Analytics

### Community 77 - "Community 77"
Cohesion: 0.43
Nodes (5): config, middleware(), parseUserJwt(), siteForHost(), sites

### Community 78 - "Community 78"
Cohesion: 0.29
Nodes (6): engines, node, msw, workerDirectory, private, public

### Community 79 - "Community 79"
Cohesion: 0.48
Nodes (4): getConfig(), SearchConfig(), getSearchConfig(), reportsRootConfig

### Community 81 - "Community 81"
Cohesion: 0.33
Nodes (6): Authentication & Authorization, Authentication Flow, Cross-Domain Cookie Management, JWT Token Structure, Role-Based Access Control (RBAC), SuperTokens Integration

### Community 82 - "Community 82"
Cohesion: 0.33
Nodes (6): Build Optimization, CI/CD Workflows, Deployment Architecture, Deployment Pipeline, Environment Configuration, Environment Variables

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (5): module.app-vars, module.ck-frontends_us-east-1, output.ck-ecs-env, provider.aws, var.deploy_tier

### Community 84 - "Community 84"
Cohesion: 0.67
Nodes (5): module.app-vars, module.ck-frontends_us-east-1, output.ck-ecs-env, provider.aws, var.deploy_tier

### Community 85 - "Community 85"
Cohesion: 0.67
Nodes (5): module.app-vars, module.ck-frontends_us-east-1, output.ck-ecs-env, provider.aws, var.deploy_tier

### Community 86 - "Community 86"
Cohesion: 0.40
Nodes (3): Support(), SupportProps, declinedSupportPhone

### Community 87 - "Community 87"
Cohesion: 0.33
Nodes (6): Architecture, Borrower Request Increase Flow, Development (w/ Docker), Production, Staging, URLs

### Community 89 - "Community 89"
Cohesion: 0.40
Nodes (5): 1. React Context API (Global State), 2. React Query (Server State), 3. Component State (Local State), 4. Form State (Formik), State Management

### Community 90 - "Community 90"
Cohesion: 0.40
Nodes (5): Custom Breakpoints, Custom Colors, Styling Best Practices, Styling System, Tailwind CSS Configuration

### Community 91 - "Community 91"
Cohesion: 0.40
Nodes (5): Test Organization, Test Types, Testing Conventions, Testing Stack, Testing Strategy

### Community 92 - "Community 92"
Cohesion: 0.80
Nodes (4): module.app-vars, module.ck-frontends, output.ck-ecs-env, var.deploy_tier

### Community 93 - "Community 93"
Cohesion: 0.67
Nodes (3): AcceptBlueHostedForm(), appendScript(), styles

### Community 94 - "Community 94"
Cohesion: 0.50
Nodes (4): Application Architecture, Component Architecture, Component Design Pattern, Next.js Architecture

### Community 96 - "Community 96"
Cohesion: 0.50
Nodes (3): baseEntity, mockUseEntity, mockUseRouter

## Knowledge Gaps
- **459 isolated node(s):** `mockApi`, `mockMakeToast`, `plaidPropsHistory`, `mockPlaidPaymentMethod`, `mockUseToast` (+454 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **68 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useEntity()` connect `Community 9` to `Community 0`, `Community 1`, `Community 2`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 15`, `Community 16`, `Community 18`, `Community 19`, `Community 21`, `Community 24`, `Community 26`, `Community 29`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 37`, `Community 40`, `Community 47`, `Community 51`, `Community 52`, `Community 54`, `Community 56`, `Community 58`, `Community 59`, `Community 61`, `Community 62`, `Community 69`, `Community 70`, `Community 96`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `useApi()` connect `Community 9` to `Community 0`, `Community 1`, `Community 2`, `Community 7`, `Community 8`, `Community 11`, `Community 12`, `Community 13`, `Community 15`, `Community 19`, `Community 21`, `Community 26`, `Community 27`, `Community 29`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 36`, `Community 38`, `Community 40`, `Community 41`, `Community 51`, `Community 52`, `Community 54`, `Community 58`, `Community 61`, `Community 70`, `Community 97`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `formatCurrency()` connect `Community 30` to `Community 7`, `Community 9`, `Community 11`, `Community 12`, `Community 22`, `Community 24`, `Community 35`, `Community 36`, `Community 37`, `Community 40`, `Community 43`, `Community 44`, `Community 46`, `Community 54`, `Community 55`, `Community 56`, `Community 59`, `Community 63`, `Community 69`, `Community 88`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `mockApi`, `mockMakeToast`, `plaidPropsHistory` to the rest of the system?**
  _459 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0602322206095791 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09663120567375887 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07678075855689177 - nodes in this community are weakly interconnected._