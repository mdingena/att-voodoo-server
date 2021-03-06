# Voodoo Server

## Architecture

```
┌──────┐               ┌───────────────┐                      ┌──────────┐                       ┌───────────────┐
│ User │               │ Voodoo Client │                      │ Alta API │                       │ Voodoo Server │
└──┬───┘               └───────┬───────┘                      └─────┬────┘                       └───────┬───────┘
   │                           │                                    │                                    │
  ┌┴┐ Clicks login             │                                    │                                    │
  │1├─────────────────────────►│                                    │                                    │
  └┬┘                          │                                    │                                    │
   │                          ┌┴┐                                   │                                    │
   │                        ┌─┤2│                                   │                                    │
   │ Generate Code Verifier │ └┬┘                                   │                                    │
   │     and Code Challenge │  │                                    │                                    │
   │                        └─►│                                    │                                    │
   │                           │  Send Code Challenge and           │                                    │
   │                          ┌┴┐ request Authorisation Code        │                                    │
   │                          │3├──────────────────────────────────►│                                    │
   │                          └┬┘                                   │                                    │
   │                           │             Redirect to auth page ┌┴┐                                   │
   │◄──────────────────────────┼───────────────────────────────────┤4│                                   │
   │                           │                                   └┬┘                                   │
  ┌┴┐ Authenticate and consent │                                    │                                    │
  │5├──────────────────────────┼───────────────────────────────────►│                                    │
  └┬┘                          │                                    │                                    │
   │                           │                Authorisation Code ┌┴┐                                   │
   │                           │◄──────────────────────────────────┤6│                                   │
   │                           │                                   └┬┘                                   │
   │                           │  Send Auth Code and Code Verifier  │                                    │
   │                          ┌┴┐ and request Access Token          │                                    │
   │                          │7├──────────────────────────────────►│                                    │
   │                          └┬┘                                   │                                    │
   │                           │                                   ┌┴┐                                   │
   │                           │                                 ┌─┤8│                                   │
   │                           │          Validate Code Verifier │ └┬┘                                   │
   │                           │              and Code Challenge │  │                                    │
   │                           │                                 └─►│                                    │
   │                           │                                    │                                    │
   │                           │           Access / Refresh Tokens ┌┴┐                                   │
   │                           │◄──────────────────────────────────┤9│                                   │
   │                           │                                   └┬┘                                   │
   │                         ┌─┴┐ Store Access Token                │                                    │
   │                         │10├───────────────────────────────────┼───────────────────────────────────►│
   │                         └─┬┘                                   │                                    │
   │                           │                                    │               Request account ID ┌─┴┐
   │                           │                                    │◄─────────────────────────────────┤11│
   │                           │                                    │                                  └─┬┘
   │                           │                                  ┌─┴┐ Account ID                        │
   │                           │                                  │12├──────────────────────────────────►│
   │                           │                                  └─┬┘                                   │
   │                           │                                    │                                  ┌─┴┐
   │                           │                                    │                                ┌─┤13│
   │                           │                              ┌─────┴────┐         Pair Access Token │ └─┬┘
   │                           │                              │ Alta API │             to account ID │   │
   │                           │                              └──────────┘                           └──►│
   │                           │                                                                         │
   │                           │                                                        User logged in ┌─┴┐
   │                           │◄──────────────────────────────────────────────────────────────────────┤14│
   │                           │                                                                       └─┬┘
   │    Wait for server join ┌─┴┐                            ┌─────────────┐                             │
   │◄────────────────────────┤15│                            │ Game Server │                             │
   │                         └─┬┘                            └──────┬──────┘                             │
 ┌─┴┐ Enters game server       │                                    │                                    │
 │16├──────────────────────────┼───────────────────────────────────►│                                    │
 └─┬┘                          │                                    │                                    │
   │                           │                                  ┌─┴┐          *Player entered* event   │
   │                           │                                  │17├──────────────────────────────────►│
   │                           │                                  └─┬┘                                   │
   │                           │                                    │                                    │
   │                           │                                    │                 Player connected ┌─┴┐
   │                           │◄───────────────────────────────────┼──────────────────────────────────┤18│
   │                           │                                    │                                  └─┬┘
   │   Show Voodoo interface ┌─┴┐                                   │                                    │
   │◄────────────────────────┤19│                                   │                                    │
   │                         └─┬┘                                   │                                    │
 ┌─┴┐ Speaks                   │                                    │                                    │
 │20├─────────────────────────►│                                    │                                    │
 └─┬┘                          │                                    │                                    │
   │                         ┌─┴┐                                   │                                    │
   │                       ┌─┤21│                                   │                                    │
   │        Speech-to-text │ └─┬┘                                   │                                    │
   │            processing │   │                                    │                                    │
   │                       └──►│                                    │                                    │
   │                           │                                    │                                    │
   │                         ┌─┴┐ Submit recognised text            │                                    │
   │                         │22├───────────────────────────────────┼───────────────────────────────────►│
   │                         └─┬┘                                   │                                    │
   │                           │                                    │                                  ┌─┴┐
   │                           │                                    │                                ┌─┤23│
   │                           │                                    │                  Validate text │ └─┬┘
   │                           │                                    │                                │   │
   │                           │                                    │                                └──►│
   │                           │                                    │                                    │
   │                           │                                    │         Matching console command ┌─┴┐
   │                           │                                    │◄───────────────────────────────┬─┤24│
   │                           │                                    │                  and/or modify │ └─┬┘
   │                           │                                    │                   Voodoo stats │   │
   │                           │                                    │                                └──►│
   │                           │                                    │                                    │
┌──┴───┐               ┌───────┴───────┐                     ┌──────┴──────┐                     ┌───────┴───────┐
│ User │               │ Voodoo Client │                     │ Game Server │                     │ Voodoo Server │
└──────┘               └───────────────┘                     └─────────────┘                     └───────────────┘
```
