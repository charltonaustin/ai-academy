# Bonus Module: Digital Twin Testing (SMS Alerts via Twilio)

## Prerequisites

**✅ Required before starting:**

- Backend REST API complete (Day 2)
- Comfortable with the Two-Tier Testing strategy (Chapter 02: unit tests WITH mocks, integration tests WITHOUT
  mocks)
- A free [Twilio](https://www.twilio.com/try-twilio) trial account (no cost — trial accounts include free credit
  and a free phone number for testing)

**If missing prerequisites:** Read Chapter 02 (Two-Tier Testing) first — this module builds directly on the "mock
blindness problem" it describes.

---

## What You'll Build

**An SMS lead-alert feature, plus a validated local "digital twin" of the Twilio API to test it against:**

1. A real integration — sending an SMS via Twilio when a high-priority lead task is created
2. A **digital twin**: a small local server that replicates Twilio's actual HTTP contract (not just a hand-guessed
   mock), validated against the real Twilio API until its behavior matches
3. Integration tests that run against the twin instead of the live Twilio API — fast, free, and deterministic,
   without ever touching Twilio's rate limits or your trial credit

**User experience:**

1. A task is created with `priority: HIGH` on a lead
2. Backend sends an SMS to the assigned rep via Twilio ("New high-priority task: Follow up with Acme Corp")
3. The existing WebSocket notification (from Day 3) still fires too — SMS is an additional channel, not a
   replacement

---

## Background: What's a "Digital Twin Universe"?

This module is a small, hands-on taste of a real technique described by StrongDM AI's "software factories" work —
see [factory.strongdm.ai](https://factory.strongdm.ai/) and specifically
[factory.strongdm.ai/techniques/dtu](https://factory.strongdm.ai/techniques/dtu). Everything below attributed to
that source is summarized from those two pages; if anything here is unclear, or you want the original framing, read
them directly.

**The problem they were solving:** when autonomous coding agents run for a long time without a human reviewing
every step, you can't validate their work by hitting real third-party APIs (Okta, Jira, Slack, Google Docs, Drive,
Sheets, in their case) — it's too slow, too expensive, hits rate limits, and can trip abuse detection at the volume
an agent needs to iterate.

**Their solution — the Digital Twin Universe (DTU):** behavioral clones of those third-party services, built at
the API boundary. In their words, the key insight is to "replicate behavior at the boundary" — build test doubles
from the real API's contract and observed edge cases, **then validate them against the live dependency until you
stop finding behavioral differences.** Once a twin is validated, it can run thousands of test scenarios per hour
with no rate limits and no API cost, including edge cases that would be awkward or unsafe to trigger against a
real production service.

**Why this is different from `jest.mock()`:** a handwritten mock is a guess about what a dependency does,
frozen at the moment you wrote it, checked against nothing. It can drift from reality silently — which is exactly
the "mock blindness problem" from Chapter 02 (the PostgreSQL-returns-strings-not-Dates bug). A digital twin is a
mock that has been *checked against the real thing* and is built at the HTTP boundary, so any code that talks to
it is exercising the same serialization, auth, and error-handling paths it would use against the real service.

**What this module is (and isn't):** StrongDM built full clones of six enterprise SaaS platforms as production
infrastructure for an autonomous-development pipeline. That's out of scope for a course project. This module is a
scaled-down exercise in the same core technique — applied to one API (Twilio's SMS endpoint) that's small enough
to fully replicate and validate in an afternoon.

---

## Implementation Guide

### Phase 1: Twilio SMS Integration (45-60 minutes)

#### Create a Twilio trial account:

1. Sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio) (free trial)
2. From the [Twilio Console](https://console.twilio.com), copy your **Account SID** and **Auth Token**
3. Get a free trial phone number: Console → Phone Numbers → Buy a Number (trial accounts get one free)
4. Verify a personal phone number to receive test messages (trial accounts can only send to verified numbers)

**Environment variables:**

```bash
# .env file
TWILIO_ACCOUNT_SID=your-account-sid-here
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_FROM_NUMBER=+15551234567
TWILIO_API_BASE_URL=https://api.twilio.com
```

**Add to `.env.example`:**

```bash
# Twilio SMS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
TWILIO_API_BASE_URL=https://api.twilio.com
```

`TWILIO_API_BASE_URL` is the important one for this module — Phase 2 points it at your local twin instead of
`https://api.twilio.com` during tests, without changing a single line of application code.

#### Install dependencies:

```bash
cd ~/ai-academy-<your-name>/backend
npm install twilio
```

#### Create the Twilio service:

**File:** `backend/src/notifications/twilio.service.ts`

```typescript
import {Injectable, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as Twilio from "twilio";

@Injectable()
export class TwilioService {
    private readonly logger = new Logger(TwilioService.name);
    private readonly client: Twilio.Twilio;
    private readonly fromNumber: string;

    constructor(private configService: ConfigService) {
        const accountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID");
        const authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");
        this.fromNumber = this.configService.get<string>("TWILIO_FROM_NUMBER");

        // Point the SDK at TWILIO_API_BASE_URL — real Twilio in production,
        // the local twin during integration tests (see Phase 2).
        this.client = Twilio(accountSid, authToken, {
            edge: undefined,
            // The Node SDK reads the base URL for API requests from this option:
            // https://api.twilio.com by default, or our twin's URL in tests.
            lazyLoading: true,
        });
        (this.client as any).baseUrl = this.configService.get<string>("TWILIO_API_BASE_URL");
    }

    async sendSms(to: string, body: string): Promise<{ sid: string; status: string }> {
        const message = await this.client.messages.create({
            to,
            from: this.fromNumber,
            body,
        });

        this.logger.log(`SMS sent: ${message.sid} (status: ${message.status})`);
        return {sid: message.sid, status: message.status};
    }
}
```

> The Twilio Node SDK's exact option name for overriding the base URL can shift between versions — check the
> installed version's docs. If it doesn't expose one, use plain `fetch`/`axios` against
> `${TWILIO_API_BASE_URL}/2010-04-01/Accounts/${accountSid}/Messages.json` instead of the SDK. Either way, the
> important part for this module is that the base URL is configurable, not which HTTP client you use.

#### Wire it into task creation:

**File:** `backend/src/tasks/tasks.service.ts`

```typescript
async
createTask(dto
:
CreateTaskDto
):
Promise < Task > {
    const task = await this.taskRepository.create(dto);

    if(task.priority === "HIGH"
)
{
    const assignedUser = await this.usersService.findById(task.assignedUserId);
    if (assignedUser?.phoneNumber) {
        await this.twilioService.sendSms(
            assignedUser.phoneNumber,
            `New high-priority task: ${task.title}`,
        );
    }
}

return task;
}
```

**Manual test:** create a high-priority task assigned to a user with your verified phone number in
`phoneNumber` — confirm the SMS arrives.

---

### Phase 2: Build a Digital Twin of the Twilio API (60-90 minutes)

This is the core exercise. Instead of `jest.mock('twilio')` — which only checks that your code *calls* the SDK
correctly, not that it handles what Twilio actually *returns* — you'll stand up a tiny local server that speaks
Twilio's real HTTP contract, and point your app at it.

**Twilio's real contract for sending a message** (verify current details against
[Twilio's API reference](https://www.twilio.com/docs/messaging/api/message-resource) — APIs change):

- `POST /2010-04-01/Accounts/{AccountSid}/Messages.json`
- Auth: HTTP Basic, `AccountSid:AuthToken`
- Body: form-encoded, `To`, `From`, `Body`
- Success response: JSON with `sid`, `status` (`queued`, `sent`, `delivered`, `failed`, ...), `to`, `from`, `body`,
  `date_created`, etc.
- Error responses use Twilio-specific error codes, e.g. `21211` (invalid `To` number), `21608` (unverified number
  on a trial account), `20429` (rate limited)

**File:** `backend/test/twilio-twin/server.ts`

```typescript
import express from "express";

const app = express();
app.use(express.urlencoded({extended: false}));

const VERIFIED_NUMBERS = new Set(["+15559876543"]); // mirror your trial account's verified numbers

function isValidE164(number: string): boolean {
    return /^\+[1-9]\d{7,14}$/.test(number);
}

app.post("/2010-04-01/Accounts/:accountSid/Messages.json", (req, res) => {
    const {To, From, Body} = req.body;

    if (!isValidE164(To)) {
        return res.status(400).json({
            code: 21211,
            message: "The 'To' number is not a valid phone number.",
            more_info: "https://www.twilio.com/docs/errors/21211",
            status: 400,
        });
    }

    if (!VERIFIED_NUMBERS.has(To)) {
        return res.status(400).json({
            code: 21608,
            message: "The number is unverified. Trial accounts may only send to verified numbers.",
            more_info: "https://www.twilio.com/docs/errors/21608",
            status: 400,
        });
    }

    const sid = `SM${"0".repeat(32)}`;
    res.status(201).json({
        sid,
        status: "queued",
        to: To,
        from: From,
        body: Body,
        date_created: new Date().toUTCString(),
    });
});

export function startTwilioTwin(port: number) {
    return app.listen(port);
}
```

**Wire it into your test setup:**

```typescript
// backend/tests/setup.ts (or a dedicated integration-test setup file)
import {startTwilioTwin} from "../test/twilio-twin/server";

let twinServer: ReturnType<typeof startTwilioTwin>;

beforeAll(() => {
    twinServer = startTwilioTwin(4010);
    process.env.TWILIO_API_BASE_URL = "http://localhost:4010";
});

afterAll(() => {
    twinServer.close();
});
```

Notice what changed in your application code to make this possible: **nothing.** `TwilioService` already reads
`TWILIO_API_BASE_URL` from config. That's the point of boundary-level replication — the twin is a drop-in
replacement for the real HTTP endpoint, not a stand-in for your SDK wrapper class.

---

### Phase 3: Validate the Twin Against the Real Service (30-45 minutes)

A twin you never checked against reality is just a fancier mock — this is the step that actually earns the name
"digital twin," and it's the part most guides on API mocking skip entirely.

**Run the same small battery of requests against both, and diff the responses:**

| Request                         | Real Twilio                                              | Your Twin | Match? |
|---------------------------------|----------------------------------------------------------|-----------|--------|
| Valid `To`, verified number     | `201`, `sid` starts `SM`, `status: "queued"`             | ?         |        |
| Malformed `To` (e.g. `"12345"`) | `400`, code `21211`                                      | ?         |        |
| Valid E.164 but unverified `To` | `400`, code `21608`                                      | ?         |        |
| Missing `Body`                  | `400`, code `21602` (verify exact code in Twilio's docs) | ?         |        |

For each row: call the real Twilio API once (using your trial credit — this costs nothing on a trial account for
a handful of test calls), call your twin with the same input, and record whether the shape, status code, and
error code match. Fix the twin until they do. Keep the table in your session log or a short `TWIN-VALIDATION.md` —
it's the evidence that your twin is trustworthy, not just plausible.

**This is the step that matters most.** Skipping it and shipping the twin from Phase 2 as-is reproduces exactly
the failure mode Chapter 02 warns about: a mock that *looks* right but was never checked against what the real
dependency actually does.

---

### Phase 4: Use the Twin in Integration Tests (20-30 minutes)

**File:** `backend/test/tasks.e2e-spec.ts`

```typescript
describe("TasksService — SMS alerts (integration, no jest.mock)", () => {
    it("sends an SMS via the Twilio twin when a HIGH priority task is created", async () => {
        const task = await tasksService.createTask({
            title: "Follow up with Acme Corp",
            priority: "HIGH",
            assignedUserId: verifiedTestUser.id,
        });

        // No mocking — this hit the real HTTP boundary (your twin), exercising
        // the same request serialization and response parsing that production uses.
        expect(task).toBeDefined();
    });

    it("handles an unverified recipient the way Twilio actually responds", async () => {
        await expect(
            tasksService.createTask({
                title: "Should fail SMS",
                priority: "HIGH",
                assignedUserId: unverifiedTestUser.id,
            }),
        ).rejects.toThrow(/unverified/i);
    });
});
```

Because the twin was validated in Phase 3, a test like the second one is actually trustworthy — it's exercising
the real error-handling code path against a response shape you've confirmed Twilio actually sends, not a guess.

**Compare this to the two-tier strategy from Chapter 02:**

- **Unit tests (WITH mocks):** still fine for testing `TasksService`'s business logic in isolation — "does a HIGH
  priority task trigger an SMS call at all?"
- **Integration tests (NO mocks, against the twin):** catch the class of bug unit tests structurally can't —
  wrong field names, unexpected error shapes, status codes your code doesn't handle
- **The twin sits underneath the integration tier**, replacing "no mocks = hit the real Twilio API" (slow,
  costs money, needs network, can't run in CI without secrets) with "no mocks = hit a validated local replica"
  (fast, free, deterministic, safe to run on every commit)

---

## Connecting the Dots

- **Chapter 02 (Two-Tier Testing):** the mock-blindness problem is exactly what twin validation (Phase 3) exists
  to prevent — a mock that was never checked against reality is how "47/47 tests passing" ships a runtime crash.
- **Chapter 08 (Deterministic Gates):** if you've built the git-hook validation gates from that chapter, a
  validated twin is what makes it safe to run integration tests on every commit — no live API calls, no secrets
  needed in CI, no rate limits to trip during a long autonomous agent session.
- **The real DTU:** StrongDM's actual system is much larger — six full SaaS clones, probabilistic "satisfaction"
  scoring across thousands of scenario runs instead of a fixed test suite, and validation as an ongoing process,
  not a one-time table. Read [factory.strongdm.ai/techniques/dtu](https://factory.strongdm.ai/techniques/dtu) if
  you want to see where this idea goes at production scale.

---

## Troubleshooting

**Twin and real Twilio disagree on an error shape?**

- Twilio's actual error codes and response shapes can differ by API version — always verify against
  [Twilio's current docs](https://www.twilio.com/docs/messaging/api/message-resource) rather than trusting a
  cached assumption (including the ones in this guide)
- Re-run Phase 3's validation table after any Twilio SDK upgrade

**Tests pass against the twin but fail against real Twilio in a manual check?**

- Your twin has drifted, or missed an edge case — that's not a failure of the exercise, it's the exercise working
  as intended. Add the failing case to the validation table, fix the twin, re-validate.

**Trial account won't send to a number?**

- Trial accounts can only send SMS to phone numbers you've verified in the Twilio Console. This is itself a good
  edge case to replicate in your twin (see the `21608` case in Phase 2).

---

**✅ Bonus Module: Digital Twin Testing**

**Back to:** [Bonus Modules Overview](README.md)
