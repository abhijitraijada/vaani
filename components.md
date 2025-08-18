### Participant interface (composed from base components)
- RegistrationTypeSelector: individual/group radios with Next
- StatusCheckForm: phone field + Check Status
- PersonalDetailsForm: name, email, phone, city, age, floor, language
- GroupMembersAccordion: dynamic member cards (add/remove)
- TransportTypeSelector: public/private toggle with hints
- VehicleDetailsFields: vehicle info + AvailableSeatsField
- DailyPreferencesForm: per-date stay/meal/limitations/toilet fields
- PreferenceWarning: conditional alerts for non-staying cases
- ReviewSectionCard: summary blocks with inline Edit buttons
- TermsAgreement: checkbox + link
- RegistrationStepper: small progress indicator for multi-step
- SubmissionSummary: final overview with Submit

Placement
- PageLayout content; StickyForm for actions; MobileSplit (summary/details).

### Manager interface
- DashboardHeader: user info + quick actions
- StatsOverview: StatCard grid (participants, hosts, assignments)
- ParticipantsFilterBar: FilterToolbar with SearchInput, StatusFilter, CityFilter, DateFilter
- ParticipantsTable: Table with status Pill, pagination, row hover
- ParticipantRowActions: View, Assign, Edit buttons
- ParticipantDetailPanel: DataList of profile + preferences
- AssignHostPanel: host lookup + selection (MobileSplit secondary)
- HostSelectorTable: list with capacity/filters and select action
- AssignmentHistoryList: OrderedList timeline of assignments
- SaveUpdateBar: StickyForm actions

Hosts management
- HostsFilterBar: FilterToolbar with search, capacity, facilities, gender
- HostsTable: Table with capacity/availability and actions
- HostCapacityCard: CapacityBar + counters
- AddHostFormModal: host creation form (modal)
- HostDetailsPanel: host info + facilities DataList
- HostAssignmentsList: assigned participants per date

### Admin interface
- AdminStatsOverview: extended StatCards (participants, hosts, seats, transport)
- EmptySeatsBoard: VehicleOwnersList + AvailableSeatsList + PublicTransportList
- TransportSummaryCards: Pill + counts
- EventsList: Table of events with actions
- CreateEventFormModal: event details, date range, location, organizers
- MealConfigurationEditor: per-date meal toggles within Card list
- OrganizersEditor: list with add/remove rows

### Host interface
- HostLookupForm: phone input + Search
- AssignedParticipantsList: list grouped by date with status markers
- HostContactCard: contact info, place, capacity snapshot

### Shared/domain composites
- PhoneLookupInline: compact phone search (header-ready)
- SectionHeaderWithActions: Heading + right-aligned actions
- EmptyState: icon + message + action
- ConfirmAssignmentDialog: specialized ConfirmDialog copy
- Success/ErrorBanner: neutral info banner using existing surfaces

Notes
- All above are pure compositions of existing primitives: Button, Fields, Table, Lists, Pill, Cards, CapacityBar, Modal/Drawer, Tooltip, Layout components.
- Typical placement: PageLayout for pages, FilterToolbar in headers, MobileSplit for list/detail, StickyForm for forms.