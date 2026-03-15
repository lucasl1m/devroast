"use client";

import { useState } from "react";

import {
  Badge,
  Button,
  type ButtonSize,
  type ButtonVariant,
  Card,
  CodeBlock,
  DiffLine,
  Input,
  InputIcon,
  InputLabel,
  ScoreRing,
  Toggle,
} from "@/components/ui";

const buttonVariants: ButtonVariant[] = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
];
const buttonSizes: ButtonSize[] = ["default", "sm", "lg"];

const badgeVariants: Array<
  "critical" | "warning" | "good" | "verdict" | "info" | "success"
> = ["critical", "warning", "good", "verdict", "info", "success"];

function getButtonVariantLabel(variant: ButtonVariant): string {
  const labels: Record<ButtonVariant, string> = {
    primary: "Roast my code",
    secondary: "Share roast",
    outline: "View all >>",
    ghost: "Ghost button",
    destructive: "Delete",
    link: "Link button",
  };
  return labels[variant] ?? variant;
}

function getButtonSizeLabel(size: ButtonSize): string {
  const labels: Record<ButtonSize, string> = {
    default: "Default",
    sm: "Small",
    lg: "Large",
    icon: "Icon",
  };
  return labels[size] ?? size;
}

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export default function ComponentsPage() {
  const [toggleOn, setToggleOn] = useState(false);

  return (
    <main className="min-h-screen bg-bg-page p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            <span className="text-accent-green">{"//"}</span> component_library
          </h1>
          <p className="text-text-secondary">
            Visualização de todos os componentes UI
          </p>
        </header>

        {/* Buttons Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">buttons</h2>
          </div>
          <p className="text-text-secondary text-sm">
            Botões com variantes e tamanhos diferentes
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                {buttonSizes.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <Button size={size} variant="primary">
                      {getButtonSizeLabel(size)}
                    </Button>
                    <span className="text-xs text-text-tertiary">{size}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Variants
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                {buttonVariants.map((variant) => (
                  <div
                    key={variant}
                    className="flex flex-col items-center gap-2"
                  >
                    <Button variant={variant}>
                      {getButtonVariantLabel(variant)}
                    </Button>
                    <span className="text-xs text-text-tertiary">
                      {variant}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Icon button
              </h3>
              <div className="flex items-center gap-4">
                <Button size="icon" variant="primary">
                  +
                </Button>
                <Button size="icon" variant="secondary">
                  ×
                </Button>
                <Button size="icon" variant="outline">
                  {"→"}
                </Button>
                <Button size="icon" variant="ghost">
                  ★
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                States
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" className="opacity-50">
                  Loading (opacity)
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Toggle Section */}
        <section className="space-y-6 pt-8 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">toggle</h2>
          </div>
          <p className="text-text-secondary text-sm">
            Switch toggle para estados on/off
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Default
              </h3>
              <div className="flex items-center gap-4">
                <Toggle checked={toggleOn} onCheckedChange={setToggleOn} />
                <span className="text-text-secondary">
                  {toggleOn ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Sizes
              </h3>
              <div className="flex items-center gap-4">
                <Toggle size="default" defaultChecked />
                <Toggle size="sm" defaultChecked />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Disabled
              </h3>
              <div className="flex items-center gap-4">
                <Toggle disabled />
                <Toggle disabled defaultChecked />
              </div>
            </div>
          </div>
        </section>

        {/* Badge Section */}
        <section className="space-y-6 pt-8 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">badges</h2>
          </div>
          <p className="text-text-secondary text-sm">
            Status badges com indicador de cor
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Variants
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                {badgeVariants.map((variant) => (
                  <div
                    key={variant}
                    className="flex flex-col items-center gap-2"
                  >
                    <Badge variant={variant}>{variant}</Badge>
                    <span className="text-xs text-text-tertiary">
                      {variant}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Without dot
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="critical" showDot={false}>
                  critical
                </Badge>
                <Badge variant="warning" showDot={false}>
                  warning
                </Badge>
                <Badge variant="good" showDot={false}>
                  good
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Sizes
              </h3>
              <div className="flex items-center gap-4">
                <Badge size="sm" variant="critical">
                  critical
                </Badge>
                <Badge size="default" variant="warning">
                  warning
                </Badge>
                <Badge size="lg" variant="good">
                  good
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* CodeBlock Section */}
        <section className="space-y-6 pt-8 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">code_block</h2>
          </div>
          <p className="text-text-secondary text-sm">
            Bloco de código com syntax highlighting (Shiki)
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Default
              </h3>
              <CodeBlock
                code={sampleCode}
                filename="calculate.js"
                lang="javascript"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Without line numbers
              </h3>
              <CodeBlock
                code={sampleCode}
                filename="calculate.js"
                lang="javascript"
                showLineNumbers={false}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Without filename
              </h3>
              <CodeBlock
                code={sampleCode}
                lang="javascript"
                showLineNumbers={true}
              />
            </div>
          </div>
        </section>

        {/* DiffLine Section */}
        <section className="space-y-6 pt-8 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">diff_line</h2>
          </div>
          <p className="text-text-secondary text-sm">
            Linhas de diff para，显示变更
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Variants
              </h3>
              <div className="border border-border-primary rounded-md overflow-hidden">
                <DiffLine variant="removed" prefix="-" code="var total = 0;" />
                <DiffLine variant="added" prefix="+" code="const total = 0;" />
                <DiffLine
                  variant="context"
                  prefix=" "
                  code="for (let i = 0; i < items.length; i++) {"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ScoreRing Section */}
        <section className="space-y-6 pt-8 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">score_ring</h2>
          </div>
          <p className="text-text-secondary text-sm">
            Arco de pontuação com gradiente
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Scores
              </h3>
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing score={3.5} />
                  <span className="text-xs text-text-tertiary">low (3.5)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing score={5.8} />
                  <span className="text-xs text-text-tertiary">
                    medium (5.8)
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing score={8.2} />
                  <span className="text-xs text-text-tertiary">high (8.2)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Section */}
        <section className="space-y-6 pt-8 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">card</h2>
          </div>
          <p className="text-text-secondary text-sm">
            Cards com parts para composição flexível
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Default
              </h3>
              <Card>
                <Card.Header>
                  <Card.Dot variant="critical" />
                  <Card.Label>critical</Card.Label>
                </Card.Header>
                <Card.Title>using var instead of const/let</Card.Title>
                <Card.Description>
                  the var keyword is function-scoped rather than block-scoped.
                </Card.Description>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Variants
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Card variant="error">
                  <Card.Header>
                    <Card.Dot variant="critical" />
                    <Card.Label>error</Card.Label>
                  </Card.Header>
                  <Card.Title>Card Title</Card.Title>
                </Card>
                <Card variant="warning">
                  <Card.Header>
                    <Card.Dot variant="warning" />
                    <Card.Label>warning</Card.Label>
                  </Card.Header>
                  <Card.Title>Card Title</Card.Title>
                </Card>
                <Card variant="success">
                  <Card.Header>
                    <Card.Dot variant="good" />
                    <Card.Label>success</Card.Label>
                  </Card.Header>
                  <Card.Title>Card Title</Card.Title>
                </Card>
                <Card>
                  <Card.Header>
                    <Card.Dot variant="info" />
                    <Card.Label>default</Card.Label>
                  </Card.Header>
                  <Card.Title>Card Title</Card.Title>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="space-y-6 pt-8 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">input</h2>
          </div>
          <p className="text-text-secondary text-sm">
            Campos de entrada com parts
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Default
              </h3>
              <div className="space-y-2 max-w-md">
                <InputLabel>Email</InputLabel>
                <Input placeholder="Enter your email" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                With icon
              </h3>
              <div className="space-y-2 max-w-md">
                <InputLabel>Search</InputLabel>
                <Input placeholder="Search...">
                  <InputIcon>🔍</InputIcon>
                </Input>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                Sizes
              </h3>
              <div className="space-y-2 max-w-md">
                <Input size="sm" placeholder="Small input" />
                <Input size="default" placeholder="Default input" />
                <Input size="lg" placeholder="Large input" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary uppercase tracking-wider">
                States
              </h3>
              <div className="space-y-2 max-w-md">
                <Input placeholder="Default" />
                <Input variant="error" placeholder="Error state" />
                <Input variant="success" placeholder="Success state" />
                <Input placeholder="Disabled" disabled />
              </div>
            </div>
          </div>
        </section>

        {/* Usage Section */}
        <section className="space-y-6 pt-8 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-xl font-bold">{"//"}</span>
            <h2 className="text-xl font-bold text-text-primary">usage</h2>
          </div>
          <pre className="bg-bg-input p-4 rounded-lg border border-border-primary text-sm text-text-secondary overflow-x-auto">
            {`import { Button, Toggle, Badge, CodeBlock, DiffLine, ScoreRing } from "@/components/ui";

<Button variant="primary" size="default">
  Roast my code
</Button>

<Toggle defaultChecked />

<Badge variant="critical">critical</Badge>

<CodeBlock code="const x = 1;" lang="typescript" filename="example.ts" />

<DiffLine variant="removed" prefix="-" code="var x = 1;" />

<ScoreRing score={7.5} />`}
          </pre>
        </section>
      </div>
    </main>
  );
}
