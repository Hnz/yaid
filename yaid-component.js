function W(n,w={}){const G=w.padding,H=n.byteLength,L=new Uint8Array(n);let V=0,q=0,J="";for(let O=0;O<H;O++){q=q<<8|L[O],V+=8;while(V>=5)J+="0123456789ABCDEFGHJKMNPQRSTVWXYZ"[q>>>V-5&31],V-=5}if(V>0)J+="0123456789ABCDEFGHJKMNPQRSTVWXYZ"[q<<5-V&31];if(G)while(J.length%8!==0)J+="=";return J}var j=function(n,w){const G=n.indexOf(w);if(G===-1)throw new Error("Invalid character found: "+w);return G};function $(n){const{length:w}=n.toUpperCase().replace(/O/g,"0").replace(/[IL]/g,"1");let G=0,H=0,L=0;const V=new Uint8Array(w*5/8|0);for(let q=0;q<w;q++)if(H=H<<5|j("0123456789ABCDEFGHJKMNPQRSTVWXYZ",n[q]),G+=5,G>=8)V[L++]=H>>>G-8&255,G-=8;return V}function X(n,w=new Date){if(typeof n==="undefined")n=R(C)[0];const G=new U;return G.setTime(w),G.setDifferentiator(R(K)),G.setMeta(n),G}function P(n){const w=$(n);return new U(w)}var R=function(n){const w=new Uint8Array(n);return y.getRandomValues(w)},z=5,K=2,C=1,Q=z+K+C,k=10,N=1099511627775,y=globalThis.crypto||crypto;class U{n;constructor(n=new Uint8Array(Q)){this.bytes=n;if(n.byteLength!=Q)throw new RangeError("bytes length must be "+Q+" not "+n.byteLength)}differentiator(){return this.bytes.slice(z,z+K)}setDifferentiator(n){this.bytes.set(n,z)}meta(){return this.bytes[z+K]}setMeta(n){if(n<0||n>255)throw new RangeError("meta must be within 0-255");this.bytes[z+K]=n}time(){const n=this.timestamp()*k;return new Date(n)}setTime(n){const w=n.getTime()/k;this.setTimestamp(w)}timestamp(){let n=0;for(let w=0;w<5;w++)n+=this.bytes[w]*Math.pow(2,8*(4-w));return n}setTimestamp(n){if(n>N)throw new Error("timestamp must not be greater than "+N);for(let w=0,G=1;w<z;w++,G*=256)this.bytes[z-1-w]=n/G&255}toBytes(){return this.bytes}toNumber(){let n=0;for(let w=this.bytes.length-1;w>=0;w--)n=n*256+this.bytes[w];return n}toString(){return W(this.bytes)}}var f=`
	<div class="grid">
		<article>
			<header>YAID</header>
			<div class="grid">
				<div>
					<label>
						ID
						<input id="yaid" type="text" minlength="8" autofocus />
					</label>
					<div class="grid">
						<button id="generateButton">Generate</button>
						<button id="copyButton">Copy</button>
					</div>
					<mark id="errorBox" style="display:none"></mark>
					<div id="infoBox" class="secondary" style="display:none"></div>
				</div>
				<div>
					<label>
						UTC Date
						<input
							id="date"
							type="datetime-local"
							min="1970-01-01T00:00:00.000"
							max="2318-06-04T06:57:57.750"
						/>
					</label>
					<label>
						Meta
						<input type="number" id="meta" min="0" max="255" />
					</label>
					<label>
						Bytes
						<input type="text" id="bytes" readonly />
					</label>
				</div>
			</div>
		</article>
	</div>
`;class Z extends HTMLElement{connectedCallback(){this.innerHTML=f,this.bytesInput=document.getElementById("bytes"),this.copyButton=document.getElementById("copyButton"),this.dateInput=document.getElementById("date"),this.errorBox=document.getElementById("errorBox"),this.generateButton=document.getElementById("generateButton"),this.infoBox=document.getElementById("infoBox"),this.metaInput=document.getElementById("meta"),this.yaidInput=document.getElementById("yaid"),this.generate(),this.dateInput.addEventListener("change",this.updateId.bind(this)),this.generateButton.addEventListener("click",this.generate.bind(this)),this.metaInput.addEventListener("change",this.updateId.bind(this)),this.yaidInput.addEventListener("input",()=>{this.yaidInput.value=this.yaidInput.value.toUpperCase(),this.parse()}),this.copyButton.addEventListener("click",()=>{navigator.clipboard.writeText(this.yaidInput.value),this.showInfo("ID copied to clipboard")})}generate(){this.y=X(),this.yaidInput.value=this.y,this.updateInfo()}parse(){try{this.y=P(this.yaidInput.value),this.updateInfo()}catch(n){this.showError(n)}}showError(n){if(n)this.errorBox.style.display="block",this.errorBox.innerText=n;else this.errorBox.style.display="none"}showInfo(n){if(n)this.infoBox.style.display="block",this.infoBox.innerText=n;else this.infoBox.style.display="none"}updateInfo(){this.dateInput.value=this.y.time().toISOString().slice(0,-1),this.metaInput.value=this.y.meta(),this.bytesInput.value=`[${this.y.bytes}]`,this.showError()}updateId(){this.y.setMeta(this.metaInput.value),this.y.setTime(new Date(this.dateInput.value)),this.yaidInput.value=this.y,this.bytesInput.value=`[${this.y.bytes}]`}}customElements.define("yaid-component",Z);export{Z as YaidComponent};

//# debugId=6CAB10A75B3974CE64756e2164756e21
