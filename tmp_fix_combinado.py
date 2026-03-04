import os

filepath = r"c:\Users\marke\Documents\Sysfac\src\app\dashboard\pos\page.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

state_target = """    // Form states
    const [amountPaid, setAmountPaid] = useState<string>("");"""

state_replacement = """    // Form states
    const [splitPayments, setSplitPayments] = useState<{method: string, amount: number}[]>([]);
    const [splitMethod, setSplitMethod] = useState("efectivo");
    const [splitAmount, setSplitAmount] = useState<string>("");
    const [amountPaid, setAmountPaid] = useState<string>("");"""

content = content.replace(state_target, state_replacement)

# Adding the logic inside the detail view
detail_target = """                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                {paymentMethod === 'efectivo' ? 'Valor entregado' : 'Valor del pago'}
                                            </Label>
                                            <Input
                                                autoFocus
                                                type="number"
                                                value={amountPaid}
                                                onChange={e => setAmountPaid(e.target.value)}
                                                className="h-14 text-2xl font-bold border-border/60 rounded-2xl focus:ring-primary shadow-inner bg-white"
                                            />
                                        </div>

                                        {paymentMethod === 'efectivo' && (
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider opacity-60">Acceso rápido</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {[Math.ceil(total), 100, 200, 500, 1000, 2000].map(val => (
                                                        <button
                                                            key={val}
                                                            onClick={() => setAmountPaid(val.toString())}
                                                            className="px-4 py-2 border border-border/40 bg-white rounded-xl text-[11px] font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                                                        >
                                                            RD${val.toLocaleString()}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>"""

detail_replacement = """                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        {paymentMethod === 'combinado' ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider opacity-60">Método</Label>
                                                        <Select value={splitMethod} onValueChange={setSplitMethod}>
                                                            <SelectTrigger className="h-12 border-border/60 rounded-xl font-bold bg-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                                                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                                                <SelectItem value="transferencia">Transferencia</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider opacity-60">Monto</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                type="number"
                                                                value={splitAmount}
                                                                onChange={e => setSplitAmount(e.target.value)}
                                                                className="h-12 text-lg font-bold border-border/60 rounded-xl focus:ring-primary shadow-inner bg-white"
                                                            />
                                                            <Button onClick={() => {
                                                                const amt = parseFloat(splitAmount);
                                                                if (amt > 0) {
                                                                    setSplitPayments([...splitPayments, { method: splitMethod, amount: amt }]);
                                                                    setSplitAmount("");
                                                                }
                                                            }} className="h-12 w-12 p-0 bg-primary rounded-xl shadow-brand text-white">
                                                                <Plus className="w-5 h-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                                                    {splitPayments.map((sp, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-border/40 rounded-xl shadow-sm">
                                                            <span className="text-xs font-bold uppercase text-muted-foreground">{sp.method}</span>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-bold text-foreground text-sm">{formatCurrency(sp.amount)}</span>
                                                                <button onClick={() => setSplitPayments(splitPayments.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {splitPayments.length > 0 && (
                                                        <div className="flex justify-between items-center p-3 mt-2 bg-primary/5 rounded-xl border border-primary/20">
                                                            <span className="text-xs font-bold uppercase text-primary">Restante</span>
                                                            <span className="font-bold text-primary">{formatCurrency(Math.max(0, total - splitPayments.reduce((a,b)=>a+b.amount,0)))}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                        {paymentMethod === 'efectivo' ? 'Valor entregado' : 'Valor del pago'}
                                                    </Label>
                                                    <Input
                                                        autoFocus
                                                        type="number"
                                                        value={amountPaid}
                                                        onChange={e => setAmountPaid(e.target.value)}
                                                        className="h-14 text-2xl font-bold border-border/60 rounded-2xl focus:ring-primary shadow-inner bg-white"
                                                    />
                                                </div>

                                                {paymentMethod === 'efectivo' && (
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider opacity-60">Acceso rápido</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {[Math.ceil(total), 100, 200, 500, 1000, 2000].map(val => (
                                                                <button
                                                                    key={val}
                                                                    onClick={() => setAmountPaid(val.toString())}
                                                                    className="px-4 py-2 border border-border/40 bg-white rounded-xl text-[11px] font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                                                                >
                                                                    RD${val.toLocaleString()}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>"""
content = content.replace(detail_target, detail_replacement)

# Update disabled state for submit button and change logic
bt_target = '''                                        <Button
                                            onClick={handleCompletePayment}
                                            className="h-14 px-12 bg-primary hover:opacity-90 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-brand shadow-primary/30"'''
bt_replacement = '''                                        <Button
                                            onClick={handleCompletePayment}
                                            disabled={paymentMethod === 'combinado' && splitPayments.reduce((a,b)=>a+b.amount,0) < total}
                                            className="h-14 px-12 bg-primary hover:opacity-90 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-brand shadow-primary/30 disabled:opacity-50 disabled:pointer-events-none"'''
content = content.replace(bt_target, bt_replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Applied combined payment changes to {filepath}")
